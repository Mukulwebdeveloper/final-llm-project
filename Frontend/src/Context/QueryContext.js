import React, { createContext, useState } from 'react';

export const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const [queries, setQueries] = useState([]);                    //for store query and display in UI
  
//   const [queries, setUserid] = useState("");

  return (
    <QueryContext.Provider value={{ queries, setQueries,}}>
      {children}
    </QueryContext.Provider>
  );
};