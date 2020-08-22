import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActionButtonsAccordion from './ActionButtonsAccordion';
import ClosetDivision from './ClosetDivision';
import './index.css';
import '../../../assets/css/style.css';

function Body() {
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
  return <Body />;
}
