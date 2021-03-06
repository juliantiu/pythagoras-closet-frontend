import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function DeleteCategoryModalForm(props) {
  const { showModal, onHideModal, categories, deleteCategory } = props;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSelectedCategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedCategory(value);
    },
    [setSelectedCategory]
  );

  const categoriesOptions = useMemo(
    () => {
      return categories.map(
        category => {
          return (
            <option key={category.id} value={category.id}>{category.name}</option>
          );
        }
      )
    },
    [categories]
  );

  const onHideModalCallback = useCallback(
    () => {
      setSelectedCategory('');
      setIsLoading(false);
      onHideModal();
    },
    [onHideModal, setSelectedCategory, setIsLoading]
  );

  const afterSaveCallback = useCallback(
    () => {
      setIsLoading(false);
      onHideModalCallback();
    },
    [setIsLoading, onHideModalCallback]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      deleteCategory(selectedCategory, afterSaveCallback);
    },
    [selectedCategory, deleteCategory, afterSaveCallback]
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
          Delete Clothing Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={onSelectedCategoryChange} value={selectedCategory}>
              <option>Select</option>
              {categoriesOptions}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHideModal} disabled={isLoading}>Close</Button>
        <Button variant="secondary" onClick={onSave} disabled={isLoading || selectedCategory === ''}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function DeleteCategoryModal() {
  const [showModal, setShowModal] = useState(false);
  const { categories, deleteCategory } = useCategoryState();

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
      <DeleteCategoryModalForm showModal={showModal} onHideModal={onHideModal} categories={categories} deleteCategory={deleteCategory}/>
      <Button className="action-button" variant="danger" onClick={onShowModal} disabled={categories.length === 0}><FontAwesomeIcon icon={faTrash}/></Button>
    </>
  );
}
