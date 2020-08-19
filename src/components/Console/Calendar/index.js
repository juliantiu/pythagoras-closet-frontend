import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './index.css';
import '../../../assets/css/style.css';
import ActionButtonsAccordion from './ActionButtonsAccordion';
import { CategoryProvider, useCategoryState } from '../../../context_hooks/CategoryState';
import { useAuthState } from '../../../context_hooks/AuthState';
import { SubcategoryProvider, useSubcategoryState } from '../../../context_hooks/SubcategoryState';
import { ClothingProvider, useClothingState } from '../../../context_hooks/ClothingState';

const timesUsed = 7;

function Body() {
  const { currentUser } = useAuthState();
  const { categories, getCategories } = useCategoryState();
  const { subcategories, getSubcategories } = useSubcategoryState();
  const { clothes, getClothes } = useClothingState();
  
  useEffect(
    () => {
      getCategories(currentUser.uid);
    },
    [getCategories, currentUser]
  );

  useEffect(
    () => {
      getSubcategories(currentUser.uid);
    },
    [getSubcategories, currentUser]
  );

  useEffect(
    () => {
      getClothes(currentUser.uid);
    },
    [getClothes, currentUser]
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
    <Container fluid>
      <Row className="mt-4">
        <Col xs={12}>
          <ActionButtonsAccordion />
        </Col>
      </Row>
      <Row>
        <Col xs={3} lg={2} className="pr-0">
        </Col>
        <Col xs={9} lg={10} className="pl-0 chart">
          <div className="column-labels-container">
            {[...Array(7).keys()].map(times => <div key={times} className="font-1 font-size-7">{times + 1}</div>)}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default function Calendar() {
  return (
    <CategoryProvider>
    <SubcategoryProvider>
    <ClothingProvider>
      <Body />
    </ClothingProvider>
    </SubcategoryProvider>
    </CategoryProvider>
  );
}
