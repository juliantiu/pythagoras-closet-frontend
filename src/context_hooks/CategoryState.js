import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getCategoriesURI = process.env.REACT_APP_API_GET_CATEGORIES;
const newCategoryURI = process.env.REACT_APP_API_NEW_CATEGORY;
const updateCategoryURI = process.env.REACT_APP_API_UPDATE_CATEGORY;
const deleteCategoryURI = process.env.REACT_APP_API_DELETE_CATEGORY;

// static URL's
const newCategoryURL = `${hostname}/${newCategoryURI}`;
const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const CategoryContext = createContext([]);

export const CategoryProvider = ({ children }) => {
  const { currentUser } = useAuthState()
  const [categories, setCategories] = useState(undefined);

  // get categories
  const getCategories = useCallback(
    async () => {
      await fetch(
        `${hostname}/${getCategoriesURI}/${currentUser.uid}`, {
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
    [setCategories, currentUser]
  );

  // add categories
  const addCategory = useCallback(
    async (name) => {
      await fetch(newCategoryURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          uid: currentUser.uid
        })
      })
      .then(resp => resp.json())
      .then(data => setCategories((prev) => {
        const prevCopy = [...prev];
        prevCopy.push(data);
        return prevCopy;
      }))
      .catch(() => { alert('Failed to add category'); });
    },
    [setCategories, currentUser]
  );

  // update categories
  const updateCategory = useCallback(
    (id, name, callback) => {
      fetch(`${updateCategoryURL}/${id}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          uid: currentUser.uid
        })
      }).then(() => {
        setCategories((prev) => {
          return prev.map(category => {
            if (category.id === id) {
              category.name = name;
            }
            return category;
          });
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to update category');
      })
    },
    [setCategories, currentUser]
  );

  // delete categories
  const deleteCategory = useCallback(
    (id, callback) => {
      fetch(`${deleteCategoryURL}/${id}`, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      }).then(() => {
        setCategories(prev => {
          return prev.filter(category => category.id !== id);
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to delete category');
      });
    },
    [setCategories]
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
