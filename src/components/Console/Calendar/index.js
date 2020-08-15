import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './index.css';
import '../../../assets/css/style.css';
import ActionButtonsAccordion from './ActionButtonsAccordion';
import { CategoryProvider, useCategoryState } from '../../../context_hooks/CategoryState';
import { useAuthState } from '../../../context_hooks/AuthState';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Body() {
  const { getCategories } = useCategoryState();
  const { currentUser } = useAuthState();
  
  useEffect(
    () => {
      getCategories(currentUser.uid);
    },
    [getCategories, currentUser]
  );

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
      <Body />
    </CategoryProvider>
  );
}
