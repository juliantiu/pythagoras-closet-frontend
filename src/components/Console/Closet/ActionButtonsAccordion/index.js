import React from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import AddSubcategoryModal from './AddSubcategoryModal';
import UpdateSubcategoryModal from './UpdateSubcategoryModal';
import DeleteSubcategoryModal from './DeleteSubcategoryModal';
import AddClothingModal from './AddClothingModal';

import './index.css';

export default function ActionButtonsAccordion() {
  return (
    <Accordion className="accordion-background ">
      <Row>
        <Col xs={12} lg={10} className="mt-3">
          <Accordion.Collapse eventKey="0">
              <Row>
                <Col xs={12} lg={4} className="d-flex mb-2">
                  <h4>Categories: </h4>
                  <AddCategoryModal />
                  <UpdateCategoryModal />
                  <DeleteCategoryModal />
                </Col>
                <Col xs={12} lg={4} className="d-flex mb-2">
                  <h4>Subcategories: </h4>
                  <AddSubcategoryModal />
                  <UpdateSubcategoryModal />
                  <DeleteSubcategoryModal />
                </Col>
                <Col xs={12} lg={4} className="d-flex mb-2">
                  <h4>Clothing: </h4>
                  <AddClothingModal />
                </Col>
              </Row>
          </Accordion.Collapse>
        </Col>
        <Col xs={12} lg={2}>
          <Accordion.Toggle as={Button} variant="dark" eventKey="0" className="d-block d-lg-none mb-3" block>Action Buttons</Accordion.Toggle>
          <Accordion.Toggle as={Button} variant="dark" eventKey="0" className="d-none d-lg-block action-button-toggle-lg">Action Buttons</Accordion.Toggle>
        </Col>
      </Row>
    </Accordion>
  );
}
