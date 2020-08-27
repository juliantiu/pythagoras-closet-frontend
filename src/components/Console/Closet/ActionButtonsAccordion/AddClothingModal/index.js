import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useClothingState } from '../../../../../context_hooks/ClothingState';
import { useCategoryState } from '../../../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../../../context_hooks/SubcategoryState';
import { formatDateToYYYYMMDD, getBase64 } from '../../../../../utils/general_util_functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function AddClothingModalForm(props) {
  const { showModal, onHideModal, subcategories} = props;
  const { categories } = useCategoryState();
  const { addClothing } = useClothingState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [thumbnailString, setThumbnailString] = useState('');
  const [usagePerLaundry, setUsagePerLaundry] = useState(1);
  const [dateBought, setDateBought] = useState(() => {
    let todayDate = new Date();
    return formatDateToYYYYMMDD(todayDate);
  });

  useEffect(
    () => {
      if (categories === undefined || categories.length === 0) return;
      setSelectedCategory(categories[0].id)
    },
    [setSelectedCategory, categories]
  );

  useEffect(
    () => {
      if (subcategories === undefined || subcategories.length === 0) return;
      setSelectedSubcategory(subcategories[0].id)
    },
    [setSelectedSubcategory, subcategories]
  );

  useEffect(
    () => {
      if (subcategories === undefined || subcategories.length === 0) return;
      setSelectedSubcategory((subcategories.find(subcategory => subcategory.categoryId === selectedCategory) ?? subcategories[0]).id);
    },
    [setSelectedSubcategory, subcategories, selectedCategory]
  );

  const onSave = useCallback(
    () => {
      addClothing(selectedSubcategory, label, thumbnailString, usagePerLaundry, dateBought, notes);
      setThumbnailString('');
      setLabel('');
      setUsagePerLaundry(1);
      setDateBought(() => {
        let todayDate = new Date();
        return formatDateToYYYYMMDD(todayDate);
      });
      onHideModal();
    }, [
      onHideModal,
      selectedSubcategory,
      label,
      thumbnailString,
      usagePerLaundry,
      dateBought,
      notes,
      addClothing,
      setUsagePerLaundry,
      setDateBought,
      setThumbnailString,
      setLabel
    ]
  );

  const onCancel = useCallback(
    () => {
      setThumbnailString('');
      setLabel('');
      setUsagePerLaundry(1);
      setDateBought(() => {
        let todayDate = new Date();
        return formatDateToYYYYMMDD(todayDate);
      });
      onHideModal();
    }, [
      setThumbnailString,
      setUsagePerLaundry,
      setDateBought,
      setLabel,
      onHideModal
    ]
  )

  const categoryOptions = useMemo(
    () => {
      return categories.map(category => <option key={`add-clothing-category-options-${category.id}`} value={category.id}>{category.name}</option>);
    },
    [categories]
  );

  const onCategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedCategory(value);
    },
    [setSelectedCategory]
  );

  const subcategoryOptions = useMemo(
    () => {
      return subcategories
        .filter(subcategory => subcategory.categoryId === selectedCategory)
        .map(subcat => <option key={`add-clothing-subcategory-options-${subcat.id}`} value={subcat.id}>{subcat.name}</option>);
    },
    [selectedCategory, subcategories]
  );

  const onSubcategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedSubcategory(value);
    },
    [setSelectedSubcategory]
  );

  const onLabelChange = useCallback(
    event => {
      const { value } = event.target;
      setLabel(value);
    },
    [setLabel]
  );

  const onNotesChange = useCallback(
    event => {
      const { value } = event.target;
      setNotes(value);
    },
    [setNotes]
  );

  const onThumbnailChange = useCallback(
    event => {
      const { files } = event.target;
      const imageFile = files[0];
      if (imageFile && imageFile.type.match('image.*')) {
        getBase64(imageFile).then(result => setThumbnailString(result));
      }
    },
    [setThumbnailString]
  );

  const onUsagePerLaundryChange = useCallback(
    event => {
      const { value } = event.target;
      setUsagePerLaundry(+value);
    },
    [setUsagePerLaundry]
  );

  const onDateBoughtChange = useCallback(
    event => {
      const { value } = event.target;
      setDateBought(() => formatDateToYYYYMMDD(new Date(value)));
    },
    [setDateBought]
  );

  const labelOrImageRequired = (thumbnailString === '' && label === '' );

  return (
    <Modal
      size="md"
      show={showModal}
      onHide={onHideModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Clothing
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
            <Form.Label>Subcategory</Form.Label>
            <Form.Control as="select" onChange={onSubcategoryChange} value={selectedSubcategory}>
              {subcategoryOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Label</Form.Label>
            <Form.Control type="text" onChange={onLabelChange} value={label}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Number of Usages Before Washing</Form.Label>
            <Form.Control type="number" onChange={onUsagePerLaundryChange} value={usagePerLaundry} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date Bought</Form.Label>
            <Form.Control type="date" onChange={onDateBoughtChange} value={dateBought} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control type="file" onChange={onThumbnailChange} accept="image/*"/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" onChange={onNotesChange} value={notes} />
          </Form.Group>
          {labelOrImageRequired && <small className="text-danger">Either provide a label or an image. They cannot both be left blank.</small>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel}>Cancel</Button>
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={selectedCategory === '' || selectedSubcategory === '' || labelOrImageRequired}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function AddClothingModal() {
  const [showModal, setShowModal] = useState(false);
  const { subcategories } = useSubcategoryState();

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
      <AddClothingModalForm showModal={showModal} onHideModal={onHideModal} subcategories={subcategories}/>
      <Button className="action-button" variant="dark" onClick={onShowModal} disabled={subcategories.length === 0}><FontAwesomeIcon icon={faPlus}/></Button>
    </>
  );
}
