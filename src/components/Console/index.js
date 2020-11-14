import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Closet from './Closet';

import { Row, Col } from 'react-bootstrap';
import { DateTime } from 'luxon';

import { CategoryProvider, useCategoryState } from '../../context_hooks/CategoryState';
import { SubcategoryProvider, useSubcategoryState } from '../../context_hooks/SubcategoryState';
import { ClothingProvider, useClothingState } from '../../context_hooks/ClothingState';
import { LaundryProvider, useLaundryState } from '../../context_hooks/LaundryState';
import { WasherProvider, useWasherState } from '../../context_hooks/WasherState';

import { Switch } from "react-router-dom";
import PrivateRoute from '../../hocs/PrivateRoute';
import DirtyLaundry from './DirtyLaundry';
import Washer from './Washer';

function Body() {
  const { categories, getCategories } = useCategoryState();
  const { subcategories, getSubcategories } = useSubcategoryState();
  const { clothes, getClothes } = useClothingState();
  const { getLaundryFromUids } = useLaundryState(); 
  const { getWasherFromUids } = useWasherState();

  useEffect(
    () => {
      getCategories();
    },
    [getCategories]
  );

  useEffect(
    () => {
      getSubcategories();
    },
    [getSubcategories]
  );

  useEffect(
    () => {
      getClothes();
    },
    [getClothes]
  );

  useEffect(
    () => {
      // Initial get request from the last year
      const todayDate = DateTime.local().startOf('day');
      const lastMonthDate = todayDate.minus({ month: 12 });
      getLaundryFromUids(lastMonthDate.toJSDate());
    },
    [getLaundryFromUids]
  );

  useEffect(
    () => {
      // Initial get request from the last year
      const todayDate = DateTime.local().startOf('day');
      const lastMonthDate = todayDate.minus({ month: 12 });
      getWasherFromUids(lastMonthDate.toJSDate());
    },
    [getWasherFromUids]
  );

  if (categories === undefined || subcategories === undefined || clothes === undefined) {
    return (
      <Row>
        <Col xs={12}>
          Loading...
        </Col>
      </Row>
    )
  }

  return (
    <Switch>
      <PrivateRoute path="/closet" component={Closet}/>
      <PrivateRoute path="/dirtylaundry" component={DirtyLaundry}/>
      <PrivateRoute path="/washer" component={Washer}/>
    </Switch>
  );
}

export default function Console() {
  return (
    <>
      <Navbar />
      <CategoryProvider>
      <SubcategoryProvider>
      <ClothingProvider>
      <LaundryProvider>
      <WasherProvider>
        <Body />
      </WasherProvider>
      </LaundryProvider>
      </ClothingProvider>
      </SubcategoryProvider>
      </CategoryProvider>
    </>
  );
}