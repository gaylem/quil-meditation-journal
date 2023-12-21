//** NEW ENTRY COMPONENT */

import React, { useState } from 'react';

// Import useEntriesContext hook for new journal entries
import { useEntriesContext } from '../hooks/useEntriesContext.js';

// Import useAuthContext hook for authentication
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import axios to handle server requests for entries data
import axios from '../axiosConfig.js';

// Import moment to format entry dates
import moment from 'moment';

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
  // Invoke moment and store in a variable
  const now = moment();

  // State and function to manage 'New Meditation' text and NewEntry toggle functionality
  const [date, setDate] = useState('New Journal Entry');
  const [open, setOpen] = useState(false);

  // Function to toggle new meditation section open and closed
  const toggle = () => {
    setOpen(!open);
    setDate(open ? 'New Journal Entry' : now.format('dddd, LL'));
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
    const entry = { body, userId };

    // Try/catch block to send POST request to the database and store the new entry
    try {
      const response = await axios.post('/api/entries', entry, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      // Reset the state
      setBody('');
      // Dispatch the new entry with response.data as the payload
      dispatch({ type: 'CREATE_ENTRY', payload: response.data });
      // Catch errors
    } catch (error) {
      console.error('Error adding entry:', error);
    }
    // When the try/catch block completes, toggle the NewEntry section closed
    toggle();
  };

  return (
    <div className='NewEntry'>
      {/* Contains the toggle button and new entry header */}
      <div className='newEntryHeader'>
        {/* Button next to 'New Meditation' that toggles the NewEntry section open/closed */}
        <button onClick={toggle}>+</button>
        {/* Displays either the date or 'New Meditation' based on the toggle state */}
        <h3>{date}</h3>
      </div>
      {/* Render the following content only if the 'open' state is true */}
      {open && (
        // Form for submitting a new entry, contains cancel and save buttons
        <form method='post' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='body' placeholder='How long did you meditate?'>
              Duration:
            </label>
            <input className='entry-duration' id='entry-duration' name='duration' placeholder='How long did you meditate?'></input>
          </div>
          <label htmlFor='body'>New Journal Entry:</label>
          <textarea className='entry-body' id='body' name='body' placeholder='How did it go?' rows={5} cols={15} onChange={e => setBody(e.target.value)} value={body} />
          {/* Cancel toggles the new entry section closed */}
          <div className='newEntryButtons'>
            <input className='cancel' type='button' onClick={toggle} value='Cancel'></input>
            {/* Save toggles the new entry section closed and saves data to database */}
            <input className='save' type='submit' value='Save'></input>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewEntry;
