import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActionButtonsAccordion from './ActionButtonsAccordion';
import { CategoryProvider, useCategoryState } from '../../../context_hooks/CategoryState';
import { useAuthState } from '../../../context_hooks/AuthState';
import { SubcategoryProvider, useSubcategoryState } from '../../../context_hooks/SubcategoryState';
import { ClothingProvider, useClothingState } from '../../../context_hooks/ClothingState';
import ClosetDivision from './ClosetDivision';
import './index.css';
import '../../../assets/css/style.css';

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
      <Row className="my-4">
        <Col xs={12}>
          <ActionButtonsAccordion />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ClosetDivision />
        </Col>
      </Row>
    </Container>
  );
}

export default function Closet() {
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
