import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Closet from './Closet';

import { Row, Col } from 'react-bootstrap';

import { CategoryProvider, useCategoryState } from '../../context_hooks/CategoryState';
import { useAuthState } from '../../context_hooks/AuthState';
import { SubcategoryProvider, useSubcategoryState } from '../../context_hooks/SubcategoryState';
import { ClothingProvider, useClothingState } from '../../context_hooks/ClothingState';
import { LaundryProvider, useLaundryState } from '../../context_hooks/LaundryState';
import { WasherProvider, useWasherState } from '../../context_hooks/WasherState';

function Body() {
  const { currentUser } = useAuthState();
  const { categories, getCategories } = useCategoryState();
  const { subcategories, getSubcategories } = useSubcategoryState();
  const { clothes, getClothes } = useClothingState();
  const { getLaundryFromClothingIds } = useLaundryState(); 
  const { getWasherFromClothingIds } = useWasherState();

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
      getClothes(currentUser.uid);
    },
    [getClothes, currentUser]
  );

  useEffect(
    () => {
      getLaundryFromClothingIds();
    },
    [getLaundryFromClothingIds]
  );

  useEffect(
    () => {
      getWasherFromClothingIds();
    },
    [getWasherFromClothingIds]
  )

  if (categories === undefined || subcategories === undefined || clothes === undefined) {
    return (
      <Row>
        <Col xs={12}>
          Loading...
        </Col>
      </Row>
    )
  }

  return <Closet />;
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