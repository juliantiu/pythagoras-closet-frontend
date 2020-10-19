import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuthState } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getClothesURI = process.env.REACT_APP_API_GET_CLOTHES;
const newClothingURI = process.env.REACT_APP_API_NEW_CLOTHING;
const updateClothingURI = process.env.REACT_APP_API_UPDATE_CLOTHING;
const deleteClothingURI = process.env.REACT_APP_API_DELETE_CLOTHING;

// static URL's
const newClothingURL = `${hostname}/${newClothingURI}`;
const updateClothingURL = `${hostname}/${updateClothingURI}`;
const deleteClothingURL = `${hostname}/${deleteClothingURI}`;


export const ClothingContext = createContext([]);

export const ClothingProvider = ({ children }) => {
  const [clothes, setClothes] = useState(undefined);
  const { currentUser } = useAuthState();

  // get clothes
  const getClothes = useCallback(
    async () => {
      await fetch(
        `${hostname}/${getClothesURI}/${currentUser.uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin'
        }
      )
      .then(resp => resp.json())
      .then(data => setClothes(data))
      .catch(() => { alert('Failed to get clothes'); })
    },
    [setClothes, currentUser]
  );

  // add clothing
  const addClothing = useCallback(
    async (subcategory, label, thumbnail, usagePerLaundry, dateBought, notes) => {
      await fetch(newClothingURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          subcategory,
          label,
          thumbnail,
          usagePerLaundry,
          dateBought,
          notes
        })
      })
      .then(resp => resp.json())
      .then(data => setClothes(prev => {
        const prevCopy = [...prev];
        prevCopy.push(data);
        return prevCopy;
      }))
      .catch(() => { alert('Failed to add clothing'); });
    },
    [setClothes, currentUser]
  );

  // update clothing
  const updateClothing = useCallback(
    async (id, subcategory, label, thumbnail, usagePerLaundry, dateBought, notes, callback) => {
      fetch(`${updateClothingURL}/${id}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          id,
          subcategory,
          label,
          thumbnail,
          usagePerLaundry,
          dateBought,
          notes
        })
      }).then(() => {
        setClothes(prev => {
          return prev.map(
            clothing => {
              if (clothing.id === id) {
                clothing.subcategory = subcategory;
                clothing.label = label; 
                clothing.thumbnail = thumbnail; 
                clothing.usagePerLaundry = usagePerLaundry; 
                clothing.dateBought = dateBought; 
                clothing.notes = notes; 
              }
              return clothing;
            }
          );
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to update category');
      })
    },
    [setClothes, currentUser]
  );

  // delete clothing
  const deleteClothing = useCallback(
    async (id, callback) => {
      fetch(`${deleteClothingURL}/${id}`, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      }).then(() => {
        setClothes(prev => {
          return prev.filter(clothing => clothing.id !== id);
        });
        callback();
      }).catch(() => {
        callback();
        alert('Failed to delete category');
      });
    },
    [setClothes]
  );

  return (
    <ClothingContext.Provider
      value={{
        clothes,
        getClothes,
        addClothing,
        updateClothing,
        deleteClothing
      }}
    >
      {children}
    </ClothingContext.Provider>
  );
}

export const useClothingState = () => {
  return useContext(ClothingContext);
}
