import React from 'react';
import { Accordion, Row, Col, Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import AddSubcategoryModal from './AddSubcategoryModal';
import UpdateSubcategoryModal from './UpdateSubcategoryModal';
import DeleteSubcategoryModal from './DeleteSubcategoryModal';

export default function ActionButtonsAccordion() {
  return (
    <Accordion>
      <Row>
        <Col xs={12} lg={2}>
          <Accordion.Toggle as={Button} variant="dark" eventKey="0" className="d-block d-lg-none mb-3" block>Action Buttons</Accordion.Toggle>
          <Accordion.Toggle as={Button} variant="dark" eventKey="0" className="d-none d-lg-block" style={{ position: 'absolute', zIndex: 1000 }}>Action Buttons</Accordion.Toggle>
        </Col>
        <Col xs={12} lg={10}>
          <Accordion.Collapse eventKey="0">
            <ButtonToolbar className="mb-5">
                <ButtonGroup className="d-flex mt-2 mt-lg-0 w-100">
                  <AddCategoryModal />
                  <UpdateCategoryModal />
                  <DeleteCategoryModal />
                </ButtonGroup>
                <ButtonGroup className="d-flex mt-2 w-100">
                  <AddSubcategoryModal />
                  <UpdateSubcategoryModal />
                  <DeleteSubcategoryModal />
                </ButtonGroup>
            </ButtonToolbar>
          </Accordion.Collapse>
        </Col>
      </Row>
    </Accordion>
  );
}
