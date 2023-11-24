// Import useContext and EntriesContext for managin entries state
import { useContext } from 'react';
import { EntriesContext } from '../context/EntryContext';

/**
 * Custom hook to access the entries context.
 *
 * @returns {Object} The entries context object.
 * @throws {Error} Throws an error if used outside of an EntriesContextProvider.
 */
export const useEntriesContext = () => {
  // Get the entries context using the useContext hook
  const context = useContext(EntriesContext);

  if (!context) {
    throw new Error('useEntriesContext must be used within an EntriesContextProvider. Make sure your component is wrapped with the EntriesContextProvider.');
  }

  // Return the entries context object
  return context;
};
