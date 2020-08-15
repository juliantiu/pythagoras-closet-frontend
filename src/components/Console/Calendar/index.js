import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './index.css';
import '../../../assets/css/style.css';
import ActionButtonsAccordion from './ActionButtonsAccordion';
import { CategoryProvider, useCategoryState } from '../../../context_hooks/CategoryState';
import { useAuthState } from '../../../context_hooks/AuthState';
import { SubcategoryProvider, useSubcategoryState } from '../../../context_hooks/SubcategoryState';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Body() {
  const { currentUser } = useAuthState();
  const { categories, getCategories } = useCategoryState();
  const { subcategories, getSubcategories } = useSubcategoryState();
  
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

  if (categories === undefined || subcategories === undefined) {
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
            {daysOfWeek.map(day => <div key={day} className="font-1 font-size-7">{day}</div>)}
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
      <Body />
    </SubcategoryProvider>
    </CategoryProvider>
  );
}
