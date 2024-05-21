import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userid, setUserid] = useState('faltu');

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userid, setUserid }}>
      {children}
    </AuthContext.Provider>
  );
};