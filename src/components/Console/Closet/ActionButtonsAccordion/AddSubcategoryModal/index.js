import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../../../context_hooks/SubcategoryState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function AddSubcategoryModalForm(props) {
  const { showModal, onHideModal, categories } = props;
  const { subcategories, addSubcategory } = useSubcategoryState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [existingSubcategory, setExistingSubcategory] = useState(false);

  useEffect(
    () => {
      if (categories === undefined || categories.length === 0) return;
      setSelectedCategory(categories[0].id)
    },
    [setSelectedCategory, categories]
  );

  const onSave = useCallback(
    () => {
      addSubcategory(selectedCategory, subcategoryName);
      setSubcategoryName('');
      onHideModal();
    },
    [onHideModal, addSubcategory, selectedCategory, subcategoryName, setSubcategoryName]
  );

  const onCancel = useCallback(
    () => {
      setSubcategoryName('');
      setExistingSubcategory(false);
      onHideModal();
    },
    [onHideModal, setSubcategoryName, setExistingSubcategory]
  )

  const categoryOptions = useMemo(
    () => {
      return categories.map(category => <option key={`add-subcategory-options-${category.id}`} value={category.id}>{category.name}</option>);
    },
    [categories]
  );

  const categoryLookup = useMemo(
    () => {
      return categories.reduce(
        (categoryLookup, category) => {
          return categoryLookup.set(category.id, subcategories.filter(subcategory => subcategory.categoryId === category.id).map(sub => sub.name));
        },
        new Map()
      );
    },
    [categories, subcategories]
  );

  const onCategoryChange = useCallback(
    (event) => {
      const { value } = event.target;
      setSelectedCategory(value);
    },
    [setSelectedCategory]
  );

  const onSubcategoryChange = useCallback(
    (event) => {
      const { value } = event.target;
      if ((categoryLookup.get(selectedCategory) ?? []).includes(value)) setExistingSubcategory(true);
      else setExistingSubcategory(false);
      setSubcategoryName(value);
    },
    [setSubcategoryName, setExistingSubcategory, categoryLookup, selectedCategory]
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
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={onCategoryChange} value={selectedCategory}>
              {categoryOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Subcategory Name</Form.Label>
            <Form.Control type="text" value={subcategoryName} onChange={onSubcategoryChange} isInvalid={existingSubcategory}/>
            <Form.Control.Feedback type="invalid">
              Originality at its finest
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={existingSubcategory || selectedCategory === ''}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function AddSubcategoryModal() {
  const [showModal, setShowModal] = useState(false);
  const { categories } = useCategoryState();

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
      <AddSubcategoryModalForm showModal={showModal} onHideModal={onHideModal} categories={categories}/>
      <Button className="action-button" variant="dark" onClick={onShowModal} disabled={categories.length === 0}><FontAwesomeIcon icon={faPlus}/></Button>
    </>
  );
}
