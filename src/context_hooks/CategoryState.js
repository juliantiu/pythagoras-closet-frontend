import React, { createContext, useState, useContext, useCallback } from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_LOCALHOST_URL;

const getCategoriesURI = process.env.REACT_APP_API_GET_CATEGORIES;
const newCategoryURI = process.env.REACT_APP_API_NEW_CATEGORY;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
// const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newCategoryURL = `${hostname}/${newCategoryURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
// const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const CategoryContext = createContext([]);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(undefined);

  // get categories
  const getCategories = useCallback(
    async (uid) => {
      await fetch(
        `${hostname}/${getCategoriesURI}/${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setCategories(data))
      .catch(() => { alert('Failed to get categories'); })
    },
    [setCategories]
  );

  // add categories
  const addCategory = useCallback(
    async (uid, name) => {
      await fetch(newCategoryURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          name,
        })
      })
      .then(() => getCategories(uid))
      .catch(() => { alert('Failed to add category'); });
    },
    [getCategories]
  );

  // update categories
  const updateCategory = useCallback(
    async (id, uid, name, category) => {
      await fetch(
        '', {

        }
      ).then(() => getCategories(uid));
    },
    [getCategories]
  );

  // delete categories
  const deleteCategory = useCallback(
    async (id, uid) => {
      await fetch(
        '', {

        }
      ).then(() => getCategories(uid));
    },
    [getCategories]
  );

  return (
    <CategoryContext.Provider
      value={{
        categories,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategoryState = () => {
  return useContext(CategoryContext);
}
