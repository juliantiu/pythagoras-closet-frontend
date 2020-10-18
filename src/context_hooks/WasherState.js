import React, { createContext, useState, useContext, useCallback } from 'react';
import { useClothingState } from './ClothingState';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getWasherFromUidURI = process.env.REACT_APP_API_GET_WASHER_FROM_UIDS;
const getWasherFromClothingIdsURI = process.env.REACT_APP_API_GET_WASHER_FROM_CLOTHING_IDS;
const newWasherURI = process.env.REACT_APP_API_NEW_WASHER;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
const deleteWasherURI = process.env.REACT_APP_API_DELETE_WASHER;

// static URL's
const newWasherURL = `${hostname}/${newWasherURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
const deleteWasherURL = `${hostname}/${deleteWasherURI}`;


export const WasherContext = createContext({});

export const WasherProvider = ({ children }) => {
  const { clothes } = useClothingState();
  const { currentUser } = useAuthState();
  const [washer, setWasher] = useState(undefined);

  // get washer
  const getWasherFromUids = useCallback(
    (startDate) => {
      fetch(
        `${hostname}/${getWasherFromUidURI}/${currentUser.uid}?startDate=${startDate.toString()}`, {
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
    [setWasher, currentUser]
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
    [setWasher, clothes]
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
          uid: currentUser.uid
        })
      })
      .then((response) => { 
        return response.json();
      })
      .then((data) => {
        setWasher((prev) => {
          const prevCopy = [...prev];
          prevCopy.unshift(data);
          return prevCopy;
        });
        callback();
      })
      .catch(() => {
        callback();
        alert('Failed to add washer');
      });
    },
    [currentUser, setWasher]
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
    id => {
      fetch(`${deleteWasherURL}/${id}`, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      })
      .then(() => {
        setWasher((prev) => {
          return prev.filter(deletedWasher => deletedWasher.id !== id);
        });
      })
      .catch(() => {
        alert('Failed to delete washer');
      });
    },
    [setWasher]
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
