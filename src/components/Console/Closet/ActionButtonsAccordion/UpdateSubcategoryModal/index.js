import React, { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateSubcategoryModalForm(props) {
  const { showModal, onHideModal } = props;

  const onSave = useCallback(
    () => {
      onHideModal();
    },
    [onHideModal]
  );

  return (
    <Modal
      size="md"
      show={showModal}
      onHide={onHideModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Clothing Subcategory
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
            <Form.Label>Current Subcategory Name</Form.Label>
            <Form.Control as="select">
              <option>Select</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>New Subcategory Name</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHideModal}>Close</Button>
        <Button onClick={onSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function UpdateSubcategoryModal() {
  const [showModal, setShowModal] = useState(false);

  const onShowModal = useCallback(
    () => {
      setShowModal(true);
    },
    [setShowModal]
  );

  const onHideModal = useCallback(
    () => {
      setShowModal(false);
    },
    [setShowModal]
  );

  return (
    <>
      <UpdateSubcategoryModalForm showModal={showModal} onHideModal={onHideModal}/>
      <Button className="w-100" variant="warning" onClick={onShowModal}>Edit Subcategory</Button>
    </>
  );
}
