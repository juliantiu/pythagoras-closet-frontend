import React, { createContext, useState, useContext, useCallback } from 'react';
import { useClothingState } from './ClothingState';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getLaundryFromUidURI = process.env.REACT_APP_API_GET_LAUNDRY_FROM_UIDS;
const getLaundryFromClothingIdsURI = process.env.REACT_APP_API_GET_LAUNDRY_FROM_CLOTHING_IDS;
const newLaundryURI = process.env.REACT_APP_API_NEW_LAUNDRY;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
const deleteLaundryURI = process.env.REACT_APP_API_DELETE_LAUNDRY;

// static URL's
const newLaundryURL = `${hostname}/${newLaundryURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
const deleteLaundryURL = `${hostname}/${deleteLaundryURI}`;


export const LaundryContext = createContext({});

export const LaundryProvider = ({ children }) => {
  const { clothes } = useClothingState();
  const { currentUser } = useAuthState();
  const [laundry, setLaundry] = useState(undefined);

  // get laundry
  const getLaundryFromUids = useCallback(
    (startDate) => {
      fetch(
        `${hostname}/${getLaundryFromUidURI}/${currentUser.uid}?startDate=${startDate.toString()}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setLaundry(data))
      .catch((error) => { 
        alert('Failed to get laundry');
      });
    },
    [setLaundry, currentUser]
  );

  const getLaundryFromClothingIds = useCallback(
    () => {
      if (clothes === undefined || clothes.length === 0) return;
      const clothingIds = clothes?.map(clothing => clothing.id) ?? [];
      fetch(
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
          uid: currentUser.uid,
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLaundry((prev) => {
          const prevCopy = [...prev];
          prevCopy.unshift(data);
          return prevCopy;
        });
        callback();
      })
      .catch(() => {
        alert('Failed to add laundry');
        callback();
      })
    },
    [setLaundry, currentUser]
  );

  // update laundry
  const updateLaundry = useCallback(
    async (id, uid, name, category) => {
      await fetch(
        '', {

        }
      ).then(() => getLaundryFromUids());
    },
    [getLaundryFromUids]
  );

  // delete laundry
  const deleteLaundry = useCallback(
    id => {
      fetch(`${deleteLaundryURL}/${id}`, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      })
      .then(() => setLaundry(prev => prev.filter(deletedLaundry => deletedLaundry.id !== id)))
      .catch(() => {
        alert('Failed to delete laundry');
      });
    },
    [setLaundry]
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
