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
          headers: { Authorization: `Bearer ${user.token.accessToken}` },
        });

        const json = response.data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : 0;
          const dateB = b.createdAt ? new Date(b.createdAt) : 0;
          return dateB - dateA;
        });

        console.log(json);

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className='pastMeditationTitle'>Past Meditation Sessions</p>
      <div className='entries'>
        {entries.map((entry, index) => (
          <PastEntry key={entry._id || index} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default PastEntriesFeed;
