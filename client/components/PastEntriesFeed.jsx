//** PAST ENTRIES FEED COMPONENT */

import React, { useEffect } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import components
import PastEntry from './PastEntry.jsx';
import NewEntry from './NewEntry.jsx';

// Import other libraries
import axios from '../axiosConfig.js';
import Cookies from 'js-cookie';

/**
 * PastEntriesFeed component renders a feed of past journal entries for the authenticated user.
 * It uses the useEntriesContext to manage state and useEffect to fetch and render past entries.
 *
 * @returns {JSX.Element} The rendered PastEntriesFeed component.
 */
const PastEntriesFeed = () => {
  // Retrieve entries and dispatch functionality from useEntriesContext
  const { entries, dispatch: entriesDispatch } = useEntriesContext();

  // Retrieve user information from useAuthContext
  const { user, dispatch: userDispatch } = useAuthContext();
  console.log('user: ', user);

  useEffect(() => {
    // Function to fetch past entries from the server
    const fetchEntries = async () => {
      try {
        // Make a GET request to the server to fetch past entries
        const response = await axios.get(`/api/entries/${user.userId}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });

        console.log('PastEntries response', response);
        // Sort the entries by createdAt date in descending order
        const sortedEntries = response.data.allEntries.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : 0;
          const dateB = b.createdAt ? new Date(b.createdAt) : 0;
          return dateB - dateA;
        });

        // If the GET request is successful (status code 200), update the entries in the context
        if (response.status === 200) {
          console.log('PastEntries 200 OK');
          // Update the access token in the cookie
          Cookies.set('user', JSON.stringify(response.data.authData), {
            expires: 28 / (24 * 60), // Expires in 28 minutes
            secure: true, // Secure attribute (requires HTTPS)
            sameSite: 'Strict', // SameSite attribute set to 'Strict'
          });

          // Update entries state
          entriesDispatch({ type: 'SET_ENTRIES', payload: sortedEntries });
          // Update tokens and user state
          userDispatch({ type: 'LOGIN', payload: response.data.authData });
          userDispatch({ type: 'ACCESS_TOKEN', payload: response.data.authData.accessToken });
          console.log('PastEntries dispatch');
        }
      } catch (error) {
        console.error('Error fetching entries:', error.stack);
        if (error.response?.data?.redirectToLogin) {
          // Clear token from cookies
          Cookies.remove('user');
          // Redirect to the login page
          window.location.href = '/login';
        }
      }
    };

    // If the user is authenticated, fetch past entries
    if (user && entries.length === 0) {
      fetchEntries();
    }
  }, [entriesDispatch, userDispatch, user]);

  // Render the PastEntriesFeed component
  return (
    <div className='feed-container'>
      {/* NewEntry component for creating new journal entries */}
      <div className='new-entry-box'>
        <NewEntry />
      </div>
      {/* Map through the entries and render each PastEntry component */}
      {entries.map((entry, index) => (
        <PastEntry key={entry._id || index} entry={entry} />
      ))}
    </div>
  );
};

export default PastEntriesFeed;
