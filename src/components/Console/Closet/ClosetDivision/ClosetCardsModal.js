import React, { useCallback, useState } from 'react';
// import { useCategoryState } from '../../../../context_hooks/CategoryState';
// import { useSubcategoryState } from '../../../../context_hooks/SubcategoryState';
// import { useClothingState } from '../../../../context_hooks/ClothingState';
import { Button, Modal, Form } from 'react-bootstrap';
import './index.css';
import { useLaundryState } from '../../../../context_hooks/LaundryState';
import { useWasherState } from '../../../../context_hooks/WasherState';

const modalEnum = {
  info: 0,
  use: 1,
  wash: 2
}

function InfoModal(props) {
  const { showInfoModal, onHideFormModals, onSaveFormModals } = props;

  const onSave = useCallback(
    () => {
      onSaveFormModals(modalEnum.info);
    },
    [onSaveFormModals]
  );

  return (
    <Modal show={showInfoModal} onHide={onHideFormModals(modalEnum.info)}>
      <Modal.Header>
        <Modal.Title>Info.</Modal.Title>
      </Modal.Header>
      <Modal.Body>What would you like to do?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHideFormModals(modalEnum.info)}>Back</Button>
        <Button variant="primary" onClick={onSave}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

function UseModal(props) {
  const { showUseModal, onHideFormModals, onSaveFormModals, id } = props;
  const { addLaundry } = useLaundryState();
  const [dateUsed, setDateUsed] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeDate = useCallback(
    (event) => {
      const { value } = event.target;
      const newDate = new Date(value);
      setDateUsed(newDate.toISOString().split('T')[0]);
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
    async () => {
      setIsLoading(true);
      addLaundry(id, dateUsed, afterSaveCallback);
      onSaveFormModals(modalEnum.use);
    },
    [onSaveFormModals, addLaundry, id, dateUsed, setIsLoading, afterSaveCallback]
  );

  return (
    <Modal show={showUseModal} onHide={onHideFormModals(modalEnum.use)}>
      <Modal.Header>
        <Modal.Title>Use</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Usage Date</Form.Label>
        <Form.Control type="date" onChange={onChangeDate} value={dateUsed}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHideFormModals(modalEnum.use)} disabled={isLoading}>Back</Button>
        <Button variant="primary" onClick={onSave} disabled={isLoading || dateUsed === ''}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

function WashModal(props) {
  const { showWashModal, onHideFormModals, onSaveFormModals, id } = props;
  const { addWasher } = useWasherState();
  const [washDate, setWashDate] = useState(new Date().toISOString().split('T')[0]);
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

  const onChangeDate = useCallback(
    (event) => {
      const { value } = event.target;
      const newDate = new Date(value);
      setWashDate(newDate.toISOString().split('T')[0]);
    },
    [setWashDate]
  );

  return (
    <Modal show={showWashModal} onHide={onHideFormModals(modalEnum.wash)}>
      <Modal.Header>
        <Modal.Title>Wash</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Wash Date</Form.Label>
        <Form.Control type="date" onChange={onChangeDate} value={washDate}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHideFormModals(modalEnum.wash)} disabled={isLoading}>Back</Button>
        <Button variant="primary" onClick={onSave} disabled={isLoading || washDate === ''}>Submit</Button>
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
    (modalType) => () => {
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
      <InfoModal showInfoModal={showInfoModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <UseModal id={id} showUseModal={showUseModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <WashModal id={id} showWashModal={showWashModal} onHideFormModals={onHideFormModals} onSaveFormModals={onSaveFormModals}/>
      <Modal show={showIntermediateModal} onHide={onHideModal}>
        <Modal.Header>
        <div className="closet-modal-title">{modalThumbnail}{' '}<p>{labelOrId}</p></div>
        </Modal.Header>
        <Modal.Body>What would you like to do?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHideModal}>Cancel</Button>
          <Button variant="primary" onClick={onShowFormModals(modalEnum.info)}>Info.</Button>
          <Button variant="primary" onClick={onShowFormModals(modalEnum.use)}>Use</Button>
          <Button variant="primary" onClick={onShowFormModals(modalEnum.wash)}>Wash</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}