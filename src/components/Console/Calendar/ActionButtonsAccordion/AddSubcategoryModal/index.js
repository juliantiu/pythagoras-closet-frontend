import React, { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddSubcategoryModalForm(props) {
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
          Add Clothing Subcategory
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Subcategory Name</Form.Label>
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

export default function AddSubcategoryModal() {
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
      <AddSubcategoryModalForm showModal={showModal} onHideModal={onHideModal}/>
      <Button className="w-100" variant="dark" onClick={onShowModal}>Add Subcategory</Button>
    </>
  );
}
