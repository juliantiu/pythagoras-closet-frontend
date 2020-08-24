import React, { useMemo, Fragment, useCallback, useState } from 'react';
import { useCategoryState } from '../../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../../context_hooks/SubcategoryState';
import { useClothingState } from '../../../../context_hooks/ClothingState';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { IntermediateModal } from './ClosetCardsModal';
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

function generateClothesJSX(clothesList, onShowIntermediateModal) {
  return clothesList.map(
    clothing => {
      const { label, id, thumbnail } = clothing;
      return (
        <div key={`closet-clothing-${id}`} className="m-1">
          <Button variant="light" onClick={onShowIntermediateModal(clothing)}>
            <Card className="closet-card">
              <div className="closet-card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
              <Card.Footer as="p" className="closet-card-title">{(label !== undefined && label !== '') ? label : id }</Card.Footer>
            </Card>
          </Button>
        </div>
      );
    }
  )
}

function generateSubcategoriesJSX(subcategoriesList, onShowIntermediateModal) {
  if (subcategoriesList === undefined) return <></>;
  return subcategoriesList.map(
    subcategory => {
      return (
        <Fragment key={`closet-subcategory-${subcategory.id}`}>
          <Row className="mb-2">
            <Col xs={12}><h5>{subcategory.name}</h5></Col>
          </Row>
          <div className="d-flex justify-content-center justify-content-sm-around justify-content-lg-start flex-wrap">
            {generateClothesJSX(subcategory.clothes, onShowIntermediateModal)}
          </div>
          <div className="mb-5" />
        </Fragment>
      );
    }
  );
}

export default function ClosetDivision() {
  const { categories } = useCategoryState();
  const { subcategories } = useSubcategoryState();
  const { clothes } = useClothingState();
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

  const closetDivisions = useMemo(
    () => {
      return closetData.map(
        category => {
          return (
            <Fragment key={`closet-category-${category.id}`}>
              <Row>
                <Col xs={12}><h2>{category.name}</h2></Col>
              </Row>
              {generateSubcategoriesJSX(category.subcategories, onShowIntermediateModal)}
              <hr />
            </Fragment>
          );
        }
      );
    },
    [closetData, onShowIntermediateModal]
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
