import React, { useEffect } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import PastEntry from './PastEntry';
import axios from '../axiosConfig';
import '../scss/pastEntriesFeed.scss';

const PastEntriesFeed = props => {
  // GET AND RENDER PAST ENTRIES
  const { entries, dispatch } = useEntriesContext();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/entries');
        dispatch({ type: 'SET_ENTRIES', payload: response.data });
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [dispatch]);

  // Check if entries is null
  if (entries === null) {
    return <div>Loading...</div>; // You can customize the loading state
  }

  // Sort entries by createdAt in descending order
  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <p className='pastMeditationTitle'>Past Meditation Sessions</p>
      <div className='entries'>
        {sortedEntries.map(entry => (
          <PastEntry key={entry._id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default PastEntriesFeed;
