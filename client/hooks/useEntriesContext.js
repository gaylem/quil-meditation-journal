// Import useContext and EntriesContext for managing entries state
import { useContext } from 'react';
import { EntriesContext } from '../context/EntryContext.jsx';

/**
 * Custom hook to access the entries context.
 *
 * @returns {Object} The entries context object.
 * @throws {Error} Throws an error if used outside of an EntriesContextProvider.
 */
export const useEntriesContext = () => {
  // Get the entries context using the useContext hook
  const entriesContext = useContext(EntriesContext);

  // Error handling
  if (!entriesContext) {
    throw new Error('useEntriesContext must be used within an EntriesContextProvider. Make sure your component is wrapped with the EntriesContextProvider.');
  }

  // Return the entries context object
  return entriesContext;
};
