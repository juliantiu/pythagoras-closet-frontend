import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSubcategoryState } from '../../../../../context_hooks/SubcategoryState';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function DeleteSubcategoryModalForm(props) {
  const { showModal, onHideModal, subcategories, deleteSubcategory } = props;
  const { categories } = useCategoryState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSaveCallbackOrCancel = useCallback(
    () => {
      setIsLoading(false)
      setSelectedSubcategory('');
      setSelectedCategory('');
      onHideModal();
    },
    [onHideModal, setSelectedSubcategory, setSelectedCategory]
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
      setSelectedSubcategory(value);
    },
    [setSelectedSubcategory]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      deleteSubcategory(selectedSubcategory, onSaveCallbackOrCancel);
    },
    [onSaveCallbackOrCancel, setIsLoading, selectedSubcategory, deleteSubcategory]
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
        subcat => {
          return (
            <option key={`update-subcategories-${subcat.id}`} value={subcat.id}>{subcat.name}</option>
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
          Delete Clothing Subcategory
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSaveCallbackOrCancel}>Close</Button>
        <Button variant="danger" onClick={onSave} disabled={isLoading || selectedSubcategory === ''}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function DeleteSubcategoryModal() {
  const [showModal, setShowModal] = useState(false);
  const { subcategories, deleteSubcategory } = useSubcategoryState();

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
      <DeleteSubcategoryModalForm showModal={showModal} onHideModal={onHideModal} subcategories={subcategories} deleteSubcategory={deleteSubcategory}/>
      <Button className="action-button" variant="danger" onClick={onShowModal} disabled={subcategories.length === 0}><FontAwesomeIcon icon={faTrash}/></Button>
    </>
  );
}
