import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getSubcategoriesURI = process.env.REACT_APP_API_GET_SUBCATEGORIES;
const newSubcategoryURI = process.env.REACT_APP_API_NEW_SUBCATEGORY;
const updateSubcategoryURI = process.env.REACT_APP_API_UPDATE_SUBCATEGORY;
const deleteSubcategoryURI = process.env.REACT_APP_API_DELETE_SUBCATEGORY;

// static URL's
const newSubcategoryURL = `${hostname}/${newSubcategoryURI}`;
const updateSubcategoryURL = `${hostname}/${updateSubcategoryURI}`;
const deleteSubcategoryURL = `${hostname}/${deleteSubcategoryURI}`;


export const SubcategoryContext = createContext([]);

export const SubcategoryProvider = ({ children }) => {
  const [subcategories, setSubcategories] = useState(undefined);
  const { currentUser } = useAuthState();

  // get subcategories
  const getSubcategories = useCallback(
    () => {
      fetch(
        `${hostname}/${getSubcategoriesURI}/${currentUser.uid}`, {
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
    [setSubcategories, currentUser]
  );

  // add subcategory
  const addSubcategory = useCallback(
    async (categoryId, name) => {
      await fetch(newSubcategoryURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          categoryId,
          name,
          uid: currentUser.uid
        })
      })
      .then(resp => resp.json())
      .then(data => setSubcategories(prev => {
        const prevCopy = [...prev];
        prevCopy.push(data);
        return prevCopy;
      }))
      .catch(() => { alert('Failed to add subcategory'); });
    },
    [setSubcategories, currentUser]
  );

  // update subcategory
  const updateSubcategory = useCallback(
    (id, categoryId, name, callback) => {
      fetch(`${updateSubcategoryURL}/${id}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id,
          categoryId,
          name,
          uid: currentUser.uid
        })
      }).then(() => {
        setSubcategories((prev) => {
          return prev.map(subcategory => {
            if (subcategory.id === id) {
              subcategory.name = name;
              subcategory.categoryId = categoryId;
            }
            return subcategory;
          });
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to update category');
      })
    },
    [setSubcategories, currentUser]
  );

  // delete subcategory
  const deleteSubcategory = useCallback(
    async (id, callback) => {
      fetch(`${deleteSubcategoryURL}/${id}`, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      }).then(() => {
        setSubcategories(prev => {
          return prev.filter(subcategory => subcategory.id !== id);
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to delete subcategory');
      });
    },
    [setSubcategories]
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
