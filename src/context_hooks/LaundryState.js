import React, { createContext, useState, useContext, useCallback } from 'react';
import { useClothingState } from './ClothingState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_LOCALHOST_URL;

const getLaundryFromUidURI = process.env.REACT_APP_API_GET_LAUNDRY_FROM_UIDS;
const getLaundryFromClothingIdsURI = process.env.REACT_APP_API_GET_LAUNDRY_FROM_CLOTHING_IDS;
const newLaundryURI = process.env.REACT_APP_API_NEW_LAUNDRY;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
// const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newLaundryURL = `${hostname}/${newLaundryURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
// const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const LaundryContext = createContext({});

export const LaundryProvider = ({ children }) => {
  const { clothes } = useClothingState();
  const [laundry, setLaundry] = useState(undefined);

  // get laundry
  const getLaundryFromUids = useCallback(
    async (uid) => {
      await fetch(
        `${hostname}/${getLaundryFromUidURI}/${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setLaundry(data))
      .catch(() => { alert('Failed to get laundry'); })
    },
    [setLaundry]
  );

  const getLaundryFromClothingIds = useCallback(
    uid => {
      if (clothes === undefined) return;
      const clothingIds = clothes?.map(clothing => clothing.id) ?? [];
      return fetch(
        `${hostname}/${getLaundryFromClothingIdsURI}`, {
          method: 'POST', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            clothingIds,
          })
        }
      )
      .then(resp => resp.json())
      .then(data => setLaundry(data))
      .catch(() => { alert('Failed to get laundry'); })
    },
    [setLaundry, clothes]
  );

  // add laundry
  const addLaundry = useCallback(
    (clothingId, dateUsed, callback) => {
      fetch(newLaundryURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          clothingId,
          dateUsed,
        })
      })
      .then(() => {
        callback();
        getLaundryFromClothingIds();
      })
      .catch(() => {
        alert('Failed to add laundry');
      })
    },
    [getLaundryFromClothingIds]
  );

  // update laundry
  const updateLaundry = useCallback(
    async (id, uid, name, category) => {
      await fetch(
        '', {

        }
      ).then(() => getLaundryFromClothingIds());
    },
    [getLaundryFromClothingIds]
  );

  // delete laundry
  const deleteLaundry = useCallback(
    async (id, uid) => {
      await fetch(
        '', {

        }
      ).then(() => getLaundryFromClothingIds());
    },
    [getLaundryFromClothingIds]
  );

  return (
    <LaundryContext.Provider
      value={{
        laundry,
        getLaundryFromUids,
        getLaundryFromClothingIds,
        addLaundry,
        updateLaundry,
        deleteLaundry
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
}

export const useLaundryState = () => {
  return useContext(LaundryContext);
}
