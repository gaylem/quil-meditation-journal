import { useContext } from 'react';
import { EntriesContext } from '../context/EntryContext';

export const useEntriesContext = () => {
  const context = useContext(EntriesContext);

  if (!context) {
    throw new Error('useEntriesContext must be used within an EntriesContextProvider. Make sure your component is wrapped with the EntriesContextProvider.');
  }

  return context;
};
