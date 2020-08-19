import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { useAuthState } from '../../../../../context_hooks/AuthState';

function AddCategoryModalForm(props) {
  const { categories, addCategory } = useCategoryState();
  const { currentUser } = useAuthState();
  const { showModal, onHideModal } = props;
  const [name, setName] = useState('');
  const [existingCategory, setExistingCategory] = useState(false);

  const categoryNamesLookup = useMemo(
    () => {
      return (categories ?? []).reduce(
        (lookup, category) => {
          return lookup.set(category.name, category.id);
        },
        new Map()
      );
    },
    [categories]
  );

  const onSave = useCallback(
    async () => {
      await addCategory(currentUser.uid, name);
      setName('');
      onHideModal();
    },
    [onHideModal, addCategory, currentUser, name, setName]
  );

  const onCancel = useCallback(
    () => {
      setName('');
      setExistingCategory(false);
      onHideModal();
    },
    [setName, setExistingCategory, onHideModal]
  );

  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      setExistingCategory(categoryNamesLookup.has(value) ?? false);
      setName(value);
    },
    [setName, setExistingCategory, categoryNamesLookup]
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
          Add Clothing Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" value={name} onChange={onChange} isInvalid={existingCategory}/>
            <Form.Control.Feedback type="invalid">
              Come on, be unique...
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={existingCategory}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function AddCategoryModal(props) {
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
      <AddCategoryModalForm showModal={showModal} onHideModal={onHideModal}/>
      <Button className="w-100" variant="dark" onClick={onShowModal}>Add Category</Button>
    </>
  );
}