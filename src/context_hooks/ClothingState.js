import React, { createContext, useState, useContext, useCallback } from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_LOCALHOST_URL :
  process.env.REACT_APP_API_HOSTED_URL;

const getClothesURI = process.env.REACT_APP_API_GET_CLOTHES;
const newClothingURI = process.env.REACT_APP_API_NEW_CLOTHING;
// const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
// const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newClothingURL = `${hostname}/${newClothingURI}`;
// const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
// const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;


export const ClothingContext = createContext([]);

export const ClothingProvider = ({ children }) => {
  const [clothes, setClothes] = useState(undefined);

  // get clothes
  const getClothes = useCallback(
    async (uid) => {
      await fetch(
        `${hostname}/${getClothesURI}/${uid}`, {
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
    [setClothes]
  );

  // add clothing
  const addClothing = useCallback(
    async (uid, subcategory, label, thumbnail, usagePerLaundry, dateBought, notes) => {
      await fetch(newClothingURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          subcategory,
          label,
          thumbnail,
          usagePerLaundry,
          dateBought,
          notes
        })
      })
      .then(() => getClothes(uid))
      .catch(() => { alert('Failed to add clothing'); });
    },
    [getClothes]
  );

  // update clothing
  const updateClothing = useCallback(
    async (id, uid, name, category) => {
      await fetch(
        '', {

        }
      ).then(() => getClothes(uid));
    },
    [getClothes]
  );

  // delete clothing
  const deleteClothing = useCallback(
    async (id, uid) => {
      await fetch(
        '', {

        }
      ).then(() => getClothes(uid));
    },
    [getClothes]
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
