import React, { createContext, useState, useContext, useCallback } from 'react';
import { useClothingState } from './ClothingState';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_LOCALHOST_URL;

const getWasherFromUidURI = process.env.REACT_APP_API_GET_WASHER_FROM_UIDS;
const getWasherFromClothingIdsURI = process.env.REACT_APP_API_GET_WASHER_FROM_CLOTHING_IDS;
const newWasherURI = process.env.REACT_APP_API_NEW_WASHER;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
// const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newWasherURL = `${hostname}/${newWasherURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
// const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const WasherContext = createContext({});

export const WasherProvider = ({ children }) => {
  const { clothes } = useClothingState();
  const { currentUser } = useAuthState();
  const [washer, setWasher] = useState(undefined);

  // get washer
  const getWasherFromUids = useCallback(
    async (uid) => {
      await fetch(
        `${hostname}/${getWasherFromUidURI}/${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setWasher(data))
      .catch(() => { alert('Failed to get washer'); })
    },
    [setWasher]
  );

  const getWasherFromClothingIds = useCallback(
    () => {
      if (clothes === undefined || clothes.length === 0) return;
      const clothingIds = clothes?.map(clothing => clothing.id) ?? [];
      return fetch(
        `${hostname}/${getWasherFromClothingIdsURI}`, {
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
      .then(data => setWasher(data))
      .catch(() => { alert('Failed to get washer'); })
    },
    [setWasher, getWasherFromUids, currentUser, clothes]
  );

  // add washer
  const addWasher = useCallback(
    (clothingId, washDate, callback) => {
      fetch(newWasherURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          clothingId,
          washDate,
        })
      })
      .then(() => { 
        callback();
        getWasherFromClothingIds();
      })
      .catch(() => {
        callback();
        alert('Failed to add washer');
      });
    },
    [getWasherFromClothingIds]
  );

  // update washer
  const updateWasher = useCallback(
    async (id, uid, name, category) => {
      await fetch(
        '', {

        }
      ).then(() => getWasherFromClothingIds());
    },
    [getWasherFromClothingIds]
  );

  // delete washer
  const deleteWasher = useCallback(
    async (id, uid) => {
      await fetch(
        '', {

        }
      ).then(() => getWasherFromClothingIds());
    },
    [getWasherFromClothingIds]
  );

  return (
    <WasherContext.Provider
      value={{
        washer,
        getWasherFromUids,
        getWasherFromClothingIds,
        addWasher,
        updateWasher,
        deleteWasher
      }}
    >
      {children}
    </WasherContext.Provider>
  );
}

export const useWasherState = () => {
  return useContext(WasherContext);
}
