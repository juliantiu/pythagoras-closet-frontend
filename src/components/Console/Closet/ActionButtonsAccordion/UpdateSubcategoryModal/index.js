import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSubcategoryState } from '../../../../../context_hooks/SubcategoryState';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';

function UpdateSubcategoryModalForm(props) {
  const { showModal, onHideModal, subcategories, updateSubcategory } = props;
  const { categories } = useCategoryState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [duplicateName, setDuplicateName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subcategoriesLookup = useMemo(
    () => {
      return subcategories.reduce(
        (lookup, subcategory) => {
          return lookup.set(subcategory.id, subcategory.name);
        },
        new Map()
      );
    },
    [subcategories]
  );

  const onSaveCallbackOrCancel = useCallback(
    () => {
      setSelectedCategory('');
      setSelectedSubcategory('');
      setNewSubcategoryName('');
      setDuplicateName(false);
      setIsLoading(false);
      onHideModal();
    },
    [onHideModal, setSelectedCategory, setSelectedSubcategory, setNewSubcategoryName, setDuplicateName, setIsLoading]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      updateSubcategory(selectedSubcategory, selectedCategory, newSubcategoryName, onSaveCallbackOrCancel);
    },
    [updateSubcategory, selectedSubcategory, selectedCategory, newSubcategoryName, setIsLoading, onSaveCallbackOrCancel]
  );

  const onCategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedCategory(value);
    },
    [setSelectedCategory]
  );

  useEffect(
    () => {
      if (subcategories === undefined || selectedCategory === '') {
        setSelectedSubcategory('');
        return;
      }
      setSelectedSubcategory((subcategories.find(subcategory => subcategory.categoryId === selectedCategory) ?? subcategories[0]).id);
    },
    [subcategories, selectedCategory, setSelectedSubcategory]
  );

  const onSubcategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedSubcategory(value)
    },
    [setSelectedSubcategory]
  );

  useEffect(
    () => {
      if (selectedSubcategory === '') {
        setNewSubcategoryName('');
        return;
      }
      setNewSubcategoryName(subcategoriesLookup.get(selectedSubcategory) ?? '');
    },
    [selectedSubcategory, subcategoriesLookup, selectedCategory, setNewSubcategoryName]
  );

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;
      if (subcategoriesLookup.get(selectedSubcategory) === value) {
        setDuplicateName(true);
      } else {
        setDuplicateName(false);
      }
      setNewSubcategoryName(value);
    },
    [setNewSubcategoryName, subcategoriesLookup, selectedSubcategory]
  );

  const categoryOptions = useMemo(
    () => {
      if (categories === undefined) return <></>;
      return categories.map(
        category => {
          return (
            <option key={`update-subcategories-${category.id}`} value={category.id}>{category.name}</option>
          )
        },
      );
    },
    [categories]
  );

  const subcategoryOptions = useMemo(
    () => {
      if (subcategories === undefined) return <></>;
      return subcategories.filter( subcategory => subcategory.categoryId === selectedCategory).map(
        category => {
          return (
            <option key={`update-subcategories-${category.id}`} value={category.id}>{category.name}</option>
          );
        }
      );
    },
    [subcategories, selectedCategory]
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
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={onCategoryChange} value={selectedCategory}>
              <option value="">Select</option>
              {categoryOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Subcategory</Form.Label>
            <Form.Control as="select" onChange={onSubcategoryChange} value={selectedSubcategory}>
              <option value="">Select</option>
              {subcategoryOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>New Subcategory Name</Form.Label>
            <Form.Control type="text" onChange={onNameChange} value={newSubcategoryName} isInvalid={duplicateName}/>
            <Form.Control.Feedback type="invalid">
              Recycling is good for the environment; not here.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSaveCallbackOrCancel} disabled={isLoading}>Close</Button>
        <Button onClick={onSave} disabled={selectedCategory === '' || selectedSubcategory === '' || newSubcategoryName === '' || duplicateName || isLoading}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function UpdateSubcategoryModal() {
  const [showModal, setShowModal] = useState(false);
  const { subcategories, updateSubcategory } = useSubcategoryState();

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
      <UpdateSubcategoryModalForm showModal={showModal} onHideModal={onHideModal} subcategories={subcategories} updateSubcategory={updateSubcategory}/>
      <Button className="w-100" variant="warning" onClick={onShowModal} disabled={subcategories.length === 0}>Edit Subcategory</Button>
    </>
  );
}
