//** NEW ENTRY COMPONENT */

import React, { useState } from 'react';

// Import hooks
import { useEntriesContext } from '../hooks/useEntriesContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import libraries
import axios from '../axiosConfig.js';
import format from 'date-fns/format';
import Cookies from 'js-cookie';

/**
 * NewEntry component handles the creation of new journal entries.
 *
 * It manages state for date display, entry body content, and toggle functionality.
 * The component interacts with the EntriesContext to dispatch new entries and with
 * the AuthContext to retrieve user information.
 *
 * @returns {JSX.Element} The rendered NewEntry component.
 */
function NewEntry() {
  // Create formatted date
  const formattedDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  // State and function to manage 'New Meditation' text and NewEntry toggle functionality
  const [date, setDate] = useState('New Journal Entry');
  const [open, setOpen] = useState(false);

  // Function to toggle new meditation section open and closed
  const toggle = () => {
    setOpen(!open);
    setDate(open ? 'New Journal Entry' : formattedDate);
  };

  // Retrieve dispatch functionality from useEntriesContext and user data from useAuthContext
  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  // State and function to manage the entry body content, errors, and empty fields
  const [body, setBody] = useState('');

  /**
   * Handles the submission of a new entry.
   *
   * @param {Event} e - The submit event.
   */
  const handleSubmit = async e => {
    e.preventDefault();

    // Extract the userId from the user object
    const userId = user.userId;

    // Store the body and the userId in an entry variable for sending to the database
    const entry = { body };

    // Try/catch block to send POST request to the database and store the new entry
    try {
      const response = await axios.post(`/api/entries/${userId}`, entry, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      // Reset the body state
      setBody('');

      if (response.status === 200) {
        // Update the access token in the cookie
        Cookies.set('user', JSON.stringify(response.data.authData), {
          expires: 28 / (24 * 60), // Expires in 28 minutes
          secure: true, // Secure attribute (requires HTTPS)
          sameSite: 'Strict', // SameSite attribute set to 'Strict'
        });
        // Dispatch the new entry with response.data as the payload
        dispatch({ type: 'CREATE_ENTRY', payload: response.data.newEntry });
        // Update tokens and user state
        dispatch({ type: 'LOGIN', payload: response.data.authData });
        dispatch({ type: 'ACCESS_TOKEN', payload: response.data.authData.accessToken });
      }
    } catch (error) {
      console.error('Error adding entry:', error.stack);
      if (error.response?.data?.redirectToLogin) {
        // Clear token from cookies
        Cookies.remove('user');
        // Redirect to the login page
        window.location.href = '/login';
      }
    }
    // When the try/catch block completes, toggle the NewEntry section closed
    toggle();
  };

  return (
    <div className='new-entry'>
      {/* Contains the toggle button and new entry header */}
      <div className='new-entry-header'>
        {/* Button next to 'New Meditation' that toggles the NewEntry section open/closed */}
        <button className='new-entry-btn' onClick={toggle}>
          +
        </button>
        {/* Displays either the date or 'New Meditation' based on the toggle state */}
        <h3>{date}</h3>
      </div>
      {/* Render the following content only if the 'open' state is true */}
      {open && (
        // Form for submitting a new entry, contains cancel and save buttons
        <form method='post' onSubmit={handleSubmit}>
          <div>
            {/* TODO: Uncomment to add duration field */}
            {/*<label htmlFor='body' placeholder='How long did you meditate?'>
              Duration:
            </label>
            <input className='entry-duration' id='entry-duration' name='duration' placeholder='ex: 10m'></input>*/}
          </div>
          <label className='visually-hidden' htmlFor='body'>
            New Journal Entry:
          </label>
          <textarea className='entry-body' id='body' name='body' placeholder='How did it go?' rows={5} cols={15} onChange={e => setBody(e.target.value)} value={body} />
          {/* Cancel toggles the new entry section closed */}
          <div className='entry-btns'>
            <input className='entry-cancel-delete-btn' type='button' onClick={toggle} value='Cancel'></input>
            {/* Save toggles the new entry section closed and saves data to database */}
            <input className='entry-save-edit-btn' type='submit' value='Save'></input>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewEntry;
