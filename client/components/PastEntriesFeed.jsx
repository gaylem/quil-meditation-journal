import React, { useEffect } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from '../axiosConfig'; 

import PastEntry from './PastEntry';
import '../scss/pastEntriesFeed.scss';

const PastEntriesFeed = () => {
  // GET AND RENDER PAST ENTRIES
  const { entries, dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/entries', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const json = response.data;

        if (response.status === 200) {
          dispatch({ type: 'SET_ENTRIES', payload: json });
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [dispatch, user]);

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
