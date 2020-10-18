import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useLaundryState } from '../../../context_hooks/LaundryState';
import { useCategoryState } from '../../../context_hooks/CategoryState';
import { useSubcategoryState } from '../../../context_hooks/SubcategoryState';
import { useClothingState } from '../../../context_hooks/ClothingState';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { formatDateToYYYYMMDD } from '../../../utils/general_util_functions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { DateTime } from 'luxon';

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

function generateLaundryList(selectedClothing, listOfClothes, laundry) {
  if (laundry === undefined) return [];
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
    laundry
      .filter(laun => listOfClothingIds.includes(laun.clothingId))
      .map(laund => ({ id: laund.id, label: clothesLookupWrapper(laund.clothingId), dateUsed: formatDateToYYYYMMDD(new Date(laund.dateUsed)) })) :
    laundry
      .filter(laun => laun.clothingId === selectedClothing)
      .map(laund => ({ id: laund.id, label: clothesLookupWrapper(laund.clothingId), dateUsed: formatDateToYYYYMMDD(new Date(laund.dateUsed)) }));
}

export default function DirtyLaundry() {
  const { laundry, deleteLaundry, getLaundryFromUids } = useLaundryState();
  const { categories } = useCategoryState();
  const { subcategories } = useSubcategoryState();
  const { clothes } = useClothingState();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedClothing, setSelectedClothing] = useState('All');
  const [selectedStartDate, setSelectedStartDate] = useState('Last month');
  const [tableTitle, setTableTitle] = useState('Starting from last month');

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

  const onStartDateChange = useCallback(
    event => {
      const { value } = event.target;
      setSelectedStartDate(value);
    },
    [setSelectedStartDate]
  );

  const onFilter = useCallback(
    () => {
      let newDate = DateTime.local().startOf('day');
      const tableTitleStartDate = `${selectedStartDate[0].toLowerCase()}${selectedStartDate.slice(1)}`;
      switch (selectedStartDate) {
        case 'All time':
          newDate = DateTime.fromObject({ year: 1970, month: 1, day: 1 });
          break;
        case 'Today':
          break;
        case 'Last week':
          newDate = newDate.minus({ days: 7 })
          break;
        case 'Last month':
          newDate = newDate.minus({ month: 1 });
          break;
        case 'Last year':
          newDate = newDate.minus({ year: 1 });
          break;
        default:
          newDate = newDate.minus({ month: 1 });
          break;
      }
      getLaundryFromUids(newDate);
      setTableTitle(`Starting from ${tableTitleStartDate}`);
    },
    [setTableTitle, getLaundryFromUids, selectedStartDate]
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
      return categories.map(category => <option key={`dirty-laundry-category-${category.id}`} value={category.id}>{category.name}</option>)
    },
    [categories]
  );

  const subcategoryOptions = useMemo(
    () => {
      if (subcategories === undefined) return <></>;
      return generateListOfSubcategories(selectedCategory, subcategories)
        .map(subcategory => <option key={`dirty-laundry-subcategory-${subcategory.id}`} value={subcategory.id}>{subcategory.name}</option>);
    },
    [subcategories, selectedCategory]
  );

  const clothingOptions = useMemo(
    () => {
      if (clothes === undefined) return <></>;
      const listOfSubcategories = generateListOfSubcategories(selectedCategory, subcategories)
      return generateListOfClothes(listOfSubcategories, clothes)
        .map(clothing => <option key={`dirty-laundry-subcategory-${clothing.id}`} value={clothing.id}>{clothing.label}</option>)
    },
    [clothes, subcategories, selectedCategory]
  );

  const [dirtyLaundryList, options] = useMemo(
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

      return [generateLaundryList(selectedClothing, listOfClothes, laundry), options];
    },
    [selectedCategory, selectedClothing, subcategories, clothes, laundry]
  );

  const deleteLaundryHandler = useCallback(
    row => () => {
      deleteLaundry(row.id);
    },
    [deleteLaundry]
  );

  const columns = useMemo(
    () => {
      const generateDeleteButton = (_, row) => {
        return (
          <div>
            <Button variant="danger" className="d-block d-lg-none" onClick={deleteLaundryHandler(row)}>X</Button>
            <Button variant="danger" className="d-none d-lg-block" onClick={deleteLaundryHandler(row)}>Delete</Button>
          </div>
        );
      }

      return [
        { dataField: 'id', text: 'Clothing Id', formatter: (cell) => (<div style={{ overflowWrap: 'break-word' }}>{cell}</div>)},
        { dataField: 'label', text: 'Label' },
        { dataField: 'dateUsed', text: 'Date Used', sort: true },
        { dataField: '', text: '', formatter: generateDeleteButton}
      ];
    },
    [deleteLaundryHandler]
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col xs={12} className="mt-3">
          <Form>
            <Form.Row>
              <Col xs={12} lg={2} className="mb-2 mb-lg-0">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" onChange={onCategoryChange} value={selectedCategory}>
                  <option value="All">All</option>
                  {categoryOptions}
                </Form.Control>
              </Col>
              <Col xs={12} lg={2} className="mb-2 mb-lg-0">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control as="select" onChange={onSubcategoryChange} value={selectedSubcategory}>
                  <option value="All">All</option>
                  {subcategoryOptions}
                </Form.Control>
              </Col>
              <Col xs={12} lg={2} className="mb-2 mb-lg-0">
                <Form.Label>Clothing</Form.Label>
                <Form.Control as="select" onChange={onClothingChange} value={selectedClothing}>
                  <option value="All">All</option>
                  {clothingOptions}
                </Form.Control>
              </Col>
              <Col xs={12} lg={2} className="mb-2 mb-lg-0">
                <Form.Label>Start Date</Form.Label>
                <Form.Control as="select" onChange={onStartDateChange} value={selectedStartDate}>
                  <option value="All time">All time</option>
                  <option value="Today">Today</option>
                  <option value="Last week">Last week</option>
                  <option value="Last month">Last month</option>
                  <option value="Last year">Last year</option>
                </Form.Control>
              </Col>
              <Col xs={12} lg={2} className="mb-2 mb-lg-0 d-flex align-items-end pl-lg-1">
                <Button onClick={onFilter} variant="dark">Filter</Button>
              </Col>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h3>{tableTitle}</h3>
          <BootstrapTable
            keyField='id'
            columns={columns}
            data={dirtyLaundryList}
            pagination={paginationFactory(options)}
            defaultSorted={[{ dataField: 'dateUsed', order: 'desc' }]} 
          />
        </Col>
      </Row>
    </Container>
  );
}
