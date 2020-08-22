import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { useAuthState } from '../../../../../context_hooks/AuthState';

function UpdateCategoryModalForm(props) {
  const { showModal, onHideModal, categories, updateCategory } = props;
  const { currentUser } = useAuthState();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateName, setDuplicateName] = useState(false);

  const categoryNameLookup = useMemo(
    () => {
      return categories.reduce(
        (lookup, category) => {
          return lookup.set(category.id, category.name);
        },
        new Map()
      );
    },
    [categories]
  );

  useEffect(
    () => {
      setNewCategoryName(categoryNameLookup.get(selectedCategory) ?? '');
    },
    [selectedCategory, categoryNameLookup, setNewCategoryName]
  );

  const onHideModalCallback = useCallback(
    () => {
      setNewCategoryName('');
      setSelectedCategory('');
      setDuplicateName(false);
      setIsLoading(false);
      onHideModal();
    },
    [onHideModal, setNewCategoryName, setSelectedCategory, setDuplicateName, setIsLoading]
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
      updateCategory(selectedCategory, currentUser.uid, newCategoryName, afterSaveCallback);
    },
    [selectedCategory, currentUser, newCategoryName, setIsLoading, updateCategory, afterSaveCallback]
  );

  const onSelectedCategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedCategory(value);
    },
    [setSelectedCategory]
  );

  const onNewCategoryNameChange = useCallback(
    event => {
      const { value } = event.target;
      if (categories.some(category => category.name === value)) {
        setDuplicateName(true);
        setNewCategoryName(value);
      } else {
        setDuplicateName(false);
        setNewCategoryName(value);
      }
    },
    [categories, setNewCategoryName, setDuplicateName]
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

  return (
    <Modal
      size="md"
      show={showModal}
      onHide={onHideModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Clothing Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
            <Form.Label>Current Category Name</Form.Label>
            <Form.Control as="select" onChange={onSelectedCategoryChange}>
              <option value=''>Select</option>
              {categoriesOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>New Category Name</Form.Label>
            <Form.Control type="text" value={newCategoryName} onChange={onNewCategoryNameChange} isInvalid={duplicateName}/>
            <Form.Control.Feedback type="invalid">
              Don't reuse names. You're better than that!
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHideModalCallback} disabled={isLoading}>Close</Button>
        <Button onClick={onSave} disabled={newCategoryName === '' || isLoading || duplicateName}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function UpdateCategoryModal() {
  const [showModal, setShowModal] = useState(false);
  const { categories, updateCategory } = useCategoryState();

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
      <UpdateCategoryModalForm showModal={showModal} onHideModal={onHideModal} categories={categories} updateCategory={updateCategory}/>
      <Button className="w-100" variant="warning" onClick={onShowModal} disabled={categories.length === 0}>Edit Category</Button>
    </>
  );
}
