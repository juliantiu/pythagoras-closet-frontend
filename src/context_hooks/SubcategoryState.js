import React, { createContext, useState, useContext, useCallback } from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_LOCALHOST_URL;

const getSubcategoriesURI = process.env.REACT_APP_API_GET_SUBCATEGORIES;
const newSubcategoryURI = process.env.REACT_APP_API_NEW_SUBCATEGORY;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
// const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newSubcategoryURL = `${hostname}/${newSubcategoryURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
// const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const SubcategoryContext = createContext([]);

export const SubcategoryProvider = ({ children }) => {
  const [subcategories, setSubcategories] = useState(undefined);

  // get subcategories
  const getSubcategories = useCallback(
    async (uid) => {
      await fetch(
        `${hostname}/${getSubcategoriesURI}/${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setSubcategories(data))
      .catch(() => { alert('Failed to get subcategories'); })
    },
    [setSubcategories]
  );

  // add subcategory
  const addSubcategory = useCallback(
    async (uid, categoryId, name) => {
      await fetch(newSubcategoryURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          categoryId,
          name,
        })
      })
      .then(() => getSubcategories())
      .catch(() => { alert('Failed to add subcategory'); });
    },
    [getSubcategories]
  );

  // update subcategory
  const updateSubcategory = useCallback(
    async (id, uid, name, subcategory) => {
      await fetch(
        '', {

        }
      ).then(() => getSubcategories(uid));
    },
    [getSubcategories]
  );

  // delete subcategory
  const deleteSubcategory = useCallback(
    async (id, uid) => {
      await fetch(
        '', {

        }
      ).then(() => getSubcategories(uid));
    },
    [getSubcategories]
  );

  return (
    <SubcategoryContext.Provider
      value={{
        subcategories,
        getSubcategories,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory
      }}
    >
      {children}
    </SubcategoryContext.Provider>
  );
}

export const useSubcategoryState = () => {
  return useContext(SubcategoryContext);
}
