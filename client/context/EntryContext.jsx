import React, { createContext, useReducer } from 'react';

export const EntriesContext = createContext();

export const entriesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ENTRIES':
      return {
        ...state,
        entries: action.payload,
      };
    case 'CREATE_ENTRY':
      return {
        ...state,
        entries: [action.payload, ...state.entries],
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const EntriesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, {
    entries: [],
  });

  return <EntriesContext.Provider value={{ ...state, dispatch }}>{children}</EntriesContext.Provider>;
};
