import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useCategoryState } from '../../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../../context_hooks/SubcategoryState';
import { useClothingState } from '../../../../context_hooks/ClothingState';
import { Button, Modal, Form } from 'react-bootstrap';
import { useLaundryState } from '../../../../context_hooks/LaundryState';
import { useWasherState } from '../../../../context_hooks/WasherState';
import { getBase64 } from '../../../../utils/general_util_functions';
import { DateTime } from 'luxon';
import './index.css';

const modalEnum = {
  info: 0,
  use: 1,
  wash: 2
}

function InfoModal(props) {
  const { showInfoModal, onHideFormModals, onSaveFormModals, selectedClothing } = props;
  const { categories } = useCategoryState();
  const { subcategories } = useSubcategoryState();
  const { updateClothing, deleteClothing } = useClothingState();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [thumbnailString, setThumbnailString] = useState('');
  const [usagePerLaundry, setUsagePerLaundry] = useState(0);
  const [dateBought, setDateBought] = useState(DateTime.local().toISODate());

  useEffect(
    () => {
      if (selectedClothing === undefined || selectedClothing === null || selectedClothing === '') return;
      setSelectedCategory(() => {
        return subcategories.find(subcategory => subcategory.id === selectedClothing.subcategoryId).categoryId;
      });
      setSelectedSubcategory(() => selectedClothing.subcategoryId);
      setLabel(() => selectedClothing.label);
      setNotes(() => selectedClothing.notes);
      setThumbnailString(() => selectedClothing.thumbnail);
      setUsagePerLaundry(() => selectedClothing.usagePerLaundry);
      setDateBought(() => DateTime.fromISO(selectedClothing.dateBought).toISODate());
    },
    [
      selectedClothing,
      subcategories,
      setSelectedCategory,
      setSelectedSubcategory,
      setLabel,
      setNotes,
      setThumbnailString,
      setUsagePerLaundry,
      setDateBought
    ]
  );

  const onCancel = useCallback(
    () => {
      setSelectedCategory(() => {
        return subcategories.find(subcategory => subcategory.id === selectedClothing.subcategoryId).categoryId;
      });
      setSelectedSubcategory(() => selectedClothing.subcategoryId);
      setLabel(() => selectedClothing.label);
      setNotes(() => selectedClothing.notes);
      setThumbnailString(() => selectedClothing.thumbnail);
      setUsagePerLaundry(() => selectedClothing.usagePerLaundry);
      setDateBought(() => DateTime.fromISO(selectedClothing.dateBought).toISODate());
      onHideFormModals(modalEnum.info);
    },
    [
      selectedClothing,
      subcategories,
      setSelectedCategory,
      setSelectedSubcategory,
      setLabel,
      setNotes,
      setUsagePerLaundry,
      setDateBought,
      setThumbnailString,
      onHideFormModals
    ]
  );

  const onSaveOrDeleteCallback = useCallback(
    () => {
      setIsLoading(false);
      onSaveFormModals(modalEnum.info);
    },
    [onSaveFormModals, setIsLoading]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      updateClothing(selectedClothing.id, selectedSubcategory, label, thumbnailString, usagePerLaundry, dateBought, notes, onSaveOrDeleteCallback);
    }, [
      selectedClothing,
      selectedSubcategory,
      label,
      thumbnailString,
      usagePerLaundry,
      dateBought,
      notes,
      updateClothing,
      onSaveOrDeleteCallback
    ]
  );

  const onDelete = useCallback(
    () => {
      deleteClothing(selectedClothing.id, onSaveOrDeleteCallback);
    },
    [deleteClothing, selectedClothing, onSaveOrDeleteCallback]
  );

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
      setDateBought(() => DateTime.fromISO(value).toISODate());
    },
    [setDateBought]
  );

  const labelOrImageRequired = (thumbnailString === '' && label === '' );

  return (
    <Modal
      size="md"
      show={showInfoModal}
      onHide={onCancel}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Info.
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
        <Button variant="danger" className="closet-modal-delete" onClick={onDelete}>Delete</Button>
        <Button variant="light" onClick={onCancel}>Cancel</Button>
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={selectedCategory === '' || selectedSubcategory === '' || labelOrImageRequired || isLoading}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UseModal(props) {
  const { showUseModal, onHideFormModals, onSaveFormModals, id } = props;
  const { addLaundry } = useLaundryState();
  const [dateUsed, setDateUsed] = useState(DateTime.local().toISODate());
  const [isLoading, setIsLoading] = useState(false);

  const onChangeDate = useCallback(
    (event) => {
      const { value } = event.target;
      setDateUsed(() => DateTime.fromISO(value).toISODate());
    },
    [setDateUsed]
  );

  const afterSaveCallback = useCallback(
    () => {
      setIsLoading(false);
      onSaveFormModals(modalEnum.use);
    },
    [setIsLoading, onSaveFormModals]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      addLaundry(id, dateUsed, afterSaveCallback);
      onSaveFormModals(modalEnum.use);
    },
    [onSaveFormModals, addLaundry, id, dateUsed, setIsLoading, afterSaveCallback]
  );

  const onCancel = useCallback(
    () => {
      setDateUsed(DateTime.local().toISODate());
      onHideFormModals(modalEnum.use);
    },
    [onHideFormModals]
  );

  return (
    <Modal show={showUseModal} onHide={onCancel}>
      <Modal.Header>
        <Modal.Title>Use</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Usage Date</Form.Label>
        <Form.Control type="date" onChange={onChangeDate} value={dateUsed}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={isLoading}>Back</Button>
        <Button variant="secondary" onClick={onSave} disabled={isLoading || dateUsed === ''}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

function WashModal(props) {
  const { showWashModal, onHideFormModals, onSaveFormModals, id } = props;
  const { addWasher } = useWasherState();
  const [washDate, setWashDate] = useState(DateTime.local().toISODate());
  const [isLoading, setIsLoading] = useState(false);
  
  const afterSaveCallback = useCallback(
    () => {
      setIsLoading(false);
      onSaveFormModals(modalEnum.wash);
    },
    [setIsLoading, onSaveFormModals]
  );

  const onSave = useCallback(
    () => {
      setIsLoading(true);
      addWasher(id, washDate, afterSaveCallback);
    },
    [addWasher, id, washDate, afterSaveCallback, setIsLoading]
  );

  const onCancel = useCallback(
    () => {
      setWashDate(DateTime.local().toISODate());
      onHideFormModals(modalEnum.wash);
    },
    [setWashDate, onHideFormModals]
  );

  const onChangeDate = useCallback(
    (event) => {
      const { value } = event.target;
      setWashDate(DateTime.fromISO(value).toISODate());
    },
    [setWashDate]
  );

  return (
    <Modal show={showWashModal} onHide={onCancel}>
      <Modal.Header>
        <Modal.Title>Wash</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Wash Date</Form.Label>
        <Form.Control type="date" onChange={onChangeDate} value={washDate}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={isLoading}>Back</Button>
        <Button variant="secondary" onClick={onSave} disabled={isLoading || washDate === ''}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

export function IntermediateModal(props) {
  const { showIntermediateModal, onShowIntermediateModalNonEvent, onHideModal, selectedClothing } = props;
  const { label, id, thumbnail } = selectedClothing;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [showWashModal, setShowWashModal] = useState(false);

  const onShowFormModals = useCallback(
    (modalType) => () => {
      switch (modalType) {
        case modalEnum.info:
          onHideModal();
          setShowInfoModal(true);
          break;
        case modalEnum.use:
          onHideModal();
          setShowUseModal(true);
          break;
        case modalEnum.wash:
          onHideModal();
          setShowWashModal(true);
          break;
        default:
          break;
      }
    },
    [setShowUseModal, setShowWashModal, setShowInfoModal, onHideModal]
  );

  const onHideFormModals = useCallback(
    (modalType) => {
      switch (modalType) {
        case modalEnum.info:
          onShowIntermediateModalNonEvent(selectedClothing);
          setShowInfoModal(false);
          break;
        case modalEnum.use:
          onShowIntermediateModalNonEvent(selectedClothing);
          setShowUseModal(false);
          break;
        case modalEnum.wash:
          onShowIntermediateModalNonEvent(selectedClothing);
          setShowWashModal(false);
          break;
        default:
          break;
      }
    },
    [setShowUseModal, setShowWashModal, setShowInfoModal, onShowIntermediateModalNonEvent, selectedClothing]
  );

  const onSaveFormModals = useCallback(
    (modalType) => {
      switch (modalType) {
        case modalEnum.info:
          setShowInfoModal(false);
          break;
        case modalEnum.use:
          setShowUseModal(false);
          break;
        case modalEnum.wash:
          setShowWashModal(false);
          break;
        default:
          break;
      }
    },
    [setShowUseModal, setShowWashModal, setShowInfoModal]
  )

  const labelOrId = (label === undefined || label === '') ? id : label;
  const modalThumbnail = <div className="closet-modal-thumbnail" style={{ backgroundImage: `url(${thumbnail})` }} />;

  return (
    <>
      <InfoModal selectedClothing={selectedClothing} showInfoModal={showInfoModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <UseModal id={id} showUseModal={showUseModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <WashModal id={id} showWashModal={showWashModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <Modal show={showIntermediateModal} onHide={onHideModal}>
        <Modal.Header>
        <div className="closet-modal-title">{modalThumbnail}{' '}<p>{labelOrId}</p></div>
        </Modal.Header>
        <Modal.Body>What would you like to do?</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHideModal}>Cancel</Button>
          <Button variant="secondary" onClick={onShowFormModals(modalEnum.info)}>Info.</Button>
          <Button variant="secondary" onClick={onShowFormModals(modalEnum.use)}>Use</Button>
          <Button variant="secondary" onClick={onShowFormModals(modalEnum.wash)}>Wash</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}