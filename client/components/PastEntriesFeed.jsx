//** PAST ENTRIES FEED COMPONENT */

import React, { useEffect } from 'react';

// Import useEntriesContext and useAuthContext to manage state
import { useEntriesContext } from '../hooks/useEntriesContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import axios for handling server requests
import axios from '../axiosConfig.js';

// Import PastEntry component for rendering individual past entries
import PastEntry from './PastEntry.jsx';

/**
 * PastEntriesFeed component renders a feed of past journal entries for the authenticated user.
 * It uses the useEntriesContext to manage state and useEffect to fetch and render past entries.
 *
 * @returns {JSX.Element} The rendered PastEntriesFeed component.
 */
const PastEntriesFeed = () => {
  // Retrieve entries and dispatch functionality from useEntriesContext
  const { entries, dispatch } = useEntriesContext();

  // Retrieve user information from useAuthContext
  const { user } = useAuthContext();

  useEffect(() => {
    // Function to fetch past entries from the server
    const fetchEntries = async () => {
      try {
        // Make a GET request to the server to fetch past entries
        const response = await axios.get(`/api/entries/${user.userId}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        // Sort the entries by createdAt date in descending order
        const sortedEntries = response.data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : 0;
          const dateB = b.createdAt ? new Date(b.createdAt) : 0;
          return dateB - dateA;
        });

        // If the GET request is successful (status code 200), update the entries in the context
        if (response.status === 200) {
          dispatch({ type: 'SET_ENTRIES', payload: sortedEntries });
        }
      } catch (error) {
        // Log an error message if there is an issue fetching entries
        console.error('Error fetching entries:', error);
      }
    };

    // If the user is authenticated, fetch past entries
    if (user) {
      fetchEntries();
    }
  }, [dispatch, user]);

  // Check if entries is null, display a loading message
  if (entries === null) {
    return <div className='loading'>Loading...</div>;
  }

  // Render the PastEntriesFeed component
  return (
    <div>
      {/* Title for the past meditation sessions */}
      <p className='pastMeditationTitle'>Past Meditation Sessions</p>
      {/* Map through the entries and render each PastEntry component */}
      {entries.map((entry, index) => (
        <PastEntry key={entry._id || index} entry={entry} />
      ))}
    </div>
  );
};

export default PastEntriesFeed;
