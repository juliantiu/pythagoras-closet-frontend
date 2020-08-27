import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useWasherState } from '../../../context_hooks/WasherState';
import { useCategoryState } from '../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../context_hooks/SubcategoryState';
import { useClothingState } from '../../../context_hooks/ClothingState';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { formatDateToYYYYMMDD } from '../../../utils/general_util_functions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

function generateListOfSubcategories(selectedCategory, subcategories) {
  if (subcategories === undefined) return [];
  if (selectedCategory === 'All') {
    return subcategories;
  }
  return subcategories.filter(subcategory => subcategory.categoryId === selectedCategory);
}

function generateListOfClothes(listOfSubcategories, clothes) {
  if (clothes === undefined) return [];
  const listOfSubcategoryIds = listOfSubcategories.map(subcategory => subcategory.id);
  return clothes.filter(clothing => listOfSubcategoryIds.includes(clothing.subcategoryId));
}

function generateWasherList(selectedClothing, listOfClothes, washer) {
  if (washer === undefined) return [];
  const clothesLookup = listOfClothes.reduce(
    (lookup, clothing) => {
      return lookup.set(clothing.id, clothing.label);
    },
    new Map()
  );
  const clothesLookupWrapper = (clothingId) => {
    return clothesLookup.get(clothingId) === '' ? clothingId : clothesLookup.get(clothingId);
  };
  const listOfClothingIds = listOfClothes.map(clothing => clothing.id);
  return selectedClothing === 'All' ?
    washer
      .filter(laun => listOfClothingIds.includes(laun.clothingId))
      .map(washer => ({ id: washer.id, label: clothesLookupWrapper(washer.clothingId), washDate: formatDateToYYYYMMDD(new Date(washer.washDate)) })) :
    washer
      .filter(laun => laun.clothingId === selectedClothing)
      .map(washer => ({ id: washer.id, label: clothesLookupWrapper(washer.clothingId), washDate: formatDateToYYYYMMDD(new Date(washer.washDate)) }));
}

export default function Washer() {
  const { washer, deleteWasher } = useWasherState();
  const { categories } = useCategoryState();
  const { subcategories } = useSubcategoryState();
  const { clothes } = useClothingState();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedClothing, setSelectedClothing] = useState('All');

  const onCategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedCategory(value);
      setSelectedSubcategory('All');
    },
    [setSelectedCategory, setSelectedSubcategory]
  );

  const onSubcategoryChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedSubcategory(value);
      setSelectedClothing('All');
    },
    [setSelectedSubcategory, setSelectedClothing]
  );

  const onClothingChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedClothing(value);
    },
    [setSelectedClothing]
  );

  useEffect(
    () => {
      setSelectedClothing('All');
    },
    [selectedSubcategory, setSelectedClothing]
  );

  const categoryOptions = useMemo(
    () => {
      if (categories === undefined) return <></>;
      return categories.map(category => <option key={`washer-category-${category.id}`} value={category.id}>{category.name}</option>)
    },
    [categories]
  );

  const subcategoryOptions = useMemo(
    () => {
      if (subcategories === undefined) return <></>;
      return generateListOfSubcategories(selectedCategory, subcategories)
        .map(subcategory => <option key={`washer-subcategory-${subcategory.id}`} value={subcategory.id}>{subcategory.name}</option>);
    },
    [subcategories, selectedCategory]
  );

  const clothingOptions = useMemo(
    () => {
      if (clothes === undefined) return <></>;
      const listOfSubcategories = generateListOfSubcategories(selectedCategory, subcategories)
      return generateListOfClothes(listOfSubcategories, clothes)
        .map(clothing => <option key={`washer-subcategory-${clothing.id}`} value={clothing.id}>{clothing.label}</option>)
    },
    [clothes, subcategories, selectedCategory]
  );

  const [WasherList, options] = useMemo(
    () => {
      const listOfSubcategories = generateListOfSubcategories(selectedCategory, subcategories);
      const listOfClothes = generateListOfClothes(listOfSubcategories, clothes);

      const options = {
        paginationSize: 10,
        pageStartIndex: 0,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        disablePageTitle: true,
        sizePerPageList: [{
          text: '10', value: 10
        }, {
          text: '25', value: 25
        }, {
          text: '50', value: 50
        }, {
          text: '100', value: 100
        }, {
          text: 'All', value: listOfClothes.length
        }]
      };

      return [generateWasherList(selectedClothing, listOfClothes, washer), options];
    },
    [selectedCategory, selectedClothing, subcategories, clothes, washer]
  );

  const deleteWasherHandler = useCallback(
    row => () => {
      deleteWasher(row.id);
    },
    [deleteWasher]
  );

  const columns = useMemo(
    () => {
      const generateDeleteButton = (_, row) => {
        return (
          <div>
            <Button variant="danger" className="d-block d-lg-none" onClick={deleteWasherHandler(row)}>X</Button>
            <Button variant="danger" className="d-none d-lg-block" onClick={deleteWasherHandler(row)}>Delete</Button>
          </div>
        );
      }

      return [
        { dataField: 'id', text: 'Clothing Id', formatter: (cell) => (<div style={{ overflowWrap: 'break-word' }}>{cell}</div>)},
        { dataField: 'label', text: 'Label' },
        { dataField: 'washDate', text: 'Date Washed', sort: true },
        { dataField: '', text: '', formatter: generateDeleteButton}
      ];
    },
    [deleteWasherHandler]
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col xs={12} className="mt-3">
          <Form>
            <Form.Row>
              <Col xs={12} lg={4} className="mb-2 mb-lg-0">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" onChange={onCategoryChange} value={selectedCategory}>
                  <option value="All">All</option>
                  {categoryOptions}
                </Form.Control>
              </Col>
              <Col xs={12} lg={4} className="mb-2 mb-lg-0">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control as="select" onChange={onSubcategoryChange} value={selectedSubcategory}>
                  <option value="All">All</option>
                  {subcategoryOptions}
                </Form.Control>
              </Col>
              <Col xs={12} lg={4} className="mb-2 mb-lg-0">
                <Form.Label>Clothing</Form.Label>
                <Form.Control as="select" onChange={onClothingChange} value={selectedClothing}>
                  <option value="All">All</option>
                  {clothingOptions}
                </Form.Control>
              </Col>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <BootstrapTable
            keyField='id'
            columns={columns}
            data={WasherList}
            pagination={paginationFactory(options)}
            defaultSorted={[{ dataField: 'dateUsed', order: 'desc' }]} 
          />
        </Col>
      </Row>
    </Container>
  );
}
