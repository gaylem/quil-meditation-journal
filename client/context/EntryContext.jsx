import React, { createContext, useReducer } from 'react';

// Import props validation
import PropTypes from 'prop-types';

/**
 * @typedef {Object} Entry
 * @property {string} _id - Unique identifier for the entry.
 * @property {string} body - Content of the entry.
 */

/**
 * @typedef {Object} EntriesState
 * @property {Entry[]} entries - List of entries.
 */

/**
 * @typedef {Object} EntriesContextValue
 * @property {EntriesState} state - Current entries state.
 * @property {Function} dispatch - Function to dispatch actions to modify the state.
 */

/**
 * Context for managing entries state.
 * @type {React.Context<EntriesContextValue>}
 */
export const EntriesContext = createContext();

/**
 * Reducer function to handle entries state changes.
 * @param {EntriesState} state - Current entries state.
 * @param {Object} action - Action to be performed.
 * @param {string} action.type - Type of action.
 * @param {any} action.payload - Payload data for the action.
 * @returns {EntriesState} New entries state.
 */
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
    case 'EDIT_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry => (entry._id === action.payload._id ? { ...entry, body: action.payload.body } : entry)),
      };
    default:
      return state;
  }
};

/**
 * Provider component to manage entries state.
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} EntriesContext.Provider component.
 */
export const EntriesContextProvider = ({ children }) => {
  /**
   * @type {[EntriesState, Function]}
   */
  const [state, dispatch] = useReducer(entriesReducer, {
    entries: [],
  });

  return <EntriesContext.Provider value={{ ...state, dispatch }}>{children}</EntriesContext.Provider>;
};

//PropTypes for the EntriesContext component
EntriesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
