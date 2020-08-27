import React, { useMemo, Fragment, useCallback, useState } from 'react';
import { useCategoryState } from '../../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../../context_hooks/SubcategoryState';
import { useClothingState } from '../../../../context_hooks/ClothingState';
import { Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import { IntermediateModal } from './ClosetCardsModal';
import { useLaundryState } from '../../../../context_hooks/LaundryState';
import { useWasherState } from '../../../../context_hooks/WasherState';
import './index.css';

function generateCategoriesToSubcategoriesLookup(subcategories, stcLookup) {
  return subcategories.reduce(
    (lookup, subcategory) => {
      const subcategoriesList = lookup?.get(subcategory.categoryId) ?? [];
      subcategoriesList.push({ ...subcategory, clothes: (stcLookup.get(subcategory.id) ?? []) });
      return lookup.set(subcategory.categoryId, subcategoriesList); 
    },
    new Map()
  );
}

function generateSubcategoriesToClothesLookup(clothes) {
  const temp = clothes.reduce(
    (lookup, clothing) => {
      const clothesList = lookup?.get(clothing.subcategoryId) ?? [];
      clothesList.push(clothing)
      return lookup.set(clothing.subcategoryId, clothesList); 
    },
    new Map()
  );
  return temp;
}

function aggregateClosetData(categories, subcategories, clothes) {
  const stcLookup = generateSubcategoriesToClothesLookup(clothes);
  const ctsLookup = generateCategoriesToSubcategoriesLookup(subcategories, stcLookup);

  return categories.map(
    category => {
      return {
        ...category,
        subcategories: ctsLookup.get(category.id)
      };
    }
  );
}

function generateClothesJSX(clothesList, onShowIntermediateModal, usageLookup) {
  return clothesList.map(
    clothing => {
      const { label, id, thumbnail, usagePerLaundry } = clothing;
      const usage = usageLookup.get(id);
      const backgroundColor = usage >= usagePerLaundry ? { backgroundColor: '#dc3545' } : { backgroundColor: '#28a745' }
      return (
        <div key={`closet-clothing-${id}`} className="m-1 closet-card-container">
          <Button variant="light" onClick={onShowIntermediateModal(clothing)}>
            <Card className="closet-card">
              <div className="closet-card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
              <Card.Footer as="p" className="closet-card-title">{(label !== undefined && label !== '') ? label : id }</Card.Footer>
            </Card>
          </Button>
          <div style={backgroundColor} className="closet-modal-usage-info">{usage}</div>
        </div>
      );
    }
  )
}

function generateSubcategoriesJSX(subcategoriesList, onShowIntermediateModal, usageLookup) {
  if (subcategoriesList === undefined) return <></>;
  return subcategoriesList.map(
    subcategory => {
      return (
        <Fragment key={`closet-subcategory-${subcategory.id}`}>
          <Row className="mb-2">
            <Col xs={12}><h5>{subcategory.name}</h5></Col>
          </Row>
          <div className="d-flex justify-content-center justify-content-sm-around justify-content-lg-start flex-wrap">
            {generateClothesJSX(subcategory.clothes, onShowIntermediateModal, usageLookup)}
          </div>
          <div className="mb-5" />
          <hr />
        </Fragment>
      );
    }
  );
}

function generateRelativeUsageForEachClothing(clothes, laundry, washer) {
  if (washer === undefined || laundry === undefined || clothes === undefined) return new Map();
  const washerLookup = washer.reduce(
    (lookup, washer) => {
      if (lookup.has(washer.clothingId)) {
        return lookup;
      }
      return lookup.set(washer.clothingId, new Date(washer.washDate));
    },
    new Map()
  );
  const laundryLookup = laundry.reduce(
    (lookup, laundry) => {
      const epoch = new Date(0, 0, 0, 0, 0, 0, 0);
      const dateWashed = washerLookup.get(laundry.clothingId) ?? epoch;
      const lookupEntry = lookup.get(laundry.clothingId) ?? 0;
      if (new Date(laundry.dateUsed).getTime() > dateWashed.getTime()) return lookup.set(laundry.clothingId, lookupEntry + 1);
      return lookup;
    },
    new Map()
  );
  return clothes.reduce(
    (lookup, clothing) => {
      return lookup.set(clothing.id, (laundryLookup.get(clothing.id) ?? 0));
    },
    new Map()
  );
}

export default function ClosetDivision() {
  const { categories } = useCategoryState();
  const { subcategories } = useSubcategoryState();
  const { clothes } = useClothingState();
  const { laundry } = useLaundryState();
  const { washer } = useWasherState();
  const [showIntermediateModal, setShowIntermediateModal] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState('');

  const onShowIntermediateModal = useCallback(
    clothing => () => {
      setSelectedClothing(clothing);
      setShowIntermediateModal(true);
    },
    [setShowIntermediateModal, setSelectedClothing]
  );

  const onShowIntermediateModalNonEvent = useCallback(
    clothing => {
      setSelectedClothing(clothing);
      setShowIntermediateModal(true);
    },
    [setShowIntermediateModal]
  );

  const onHideModal = useCallback(
    () => {
      setShowIntermediateModal(false);
    },
    [setShowIntermediateModal]
  );

  const closetData = useMemo(
    () => {
      return aggregateClosetData(categories, subcategories, clothes);
    },
    [categories, subcategories, clothes]
  );

  const usageLookup = useMemo(
    () => {
      return generateRelativeUsageForEachClothing(clothes, laundry, washer);
    },
    [clothes, laundry, washer]
  );

  const closetDivisions = useMemo(
    () => {
      return closetData.map(
        category => {
          return (
            <Fragment key={`closet-category-${category.id}`}>
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="light" eventKey={category.id}>{category.name}</Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={category.id}>
                    <Card.Body>{generateSubcategoriesJSX(category.subcategories, onShowIntermediateModal, usageLookup)}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Fragment>
          );
        }
      );
    },
    [closetData, onShowIntermediateModal, usageLookup]
  );

  return (
    <Row>
      <Col xs={12}>
        <IntermediateModal
          showIntermediateModal={showIntermediateModal}
          onShowIntermediateModalNonEvent={onShowIntermediateModalNonEvent}
          onHideModal={onHideModal}
          selectedClothing={selectedClothing}
        />
        {closetDivisions}
      </Col>
    </Row>
  );
}
