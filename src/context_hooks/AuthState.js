import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import app from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    app.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  const logout = useCallback(
    () => app.auth().signOut(),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthState() {
  return useContext(AuthContext);
}