// Import React, useState, and contexts
import React, { useState } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext';

// Import styles
import '../scss/newEntry.scss';

// Import axios to handle server requests for entries data
import axios from '../axiosConfig';

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
  const [date, setDate] = useState('New Meditation');
  const [open, setOpen] = useState(false);

  // Function to toggle new meditation section open and closed
  const toggle = () => {
    setOpen(!open);
    setDate(open ? 'New Meditation' : now.format('dddd, LL'));
  };

  // Retrieve dispatch functionality from useEntriesContext and user data from useAuthContext
  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  // State and function to manage the entry body content, errors, and empty fields
  const [body, setBody] = useState('');
  // TODO: Use to display error messaging on the frontend, requires UI changes
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  /**
   * Handles the submission of a new entry.
   *
   * @param {Event} e - The submit event.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    // If a user is not logged in, they will receive an error message that says "You must be logged in"
    // TODO: Does this display anywhere on the frontend? The user also shouldn't be able to even see the newEntry field if they aren't logged in, so will this redirect them?
    if (!user) {
      setError('You must be logged in');
      return;
    }

    // Extract the userId from the user object
    const userId = user.userId;

    // Store the body and the userId in an entry variable for sending to the database
    const entry = { body, userId };
    
    // Try/catch block to send POST request to the database and store the new entry
    try {
      const response = await axios.post('/api/entries', entry, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Reset the state
      setBody('');
      setError(null);
      setEmptyFields([]);
      // Dispatch the new entry with response.data as the payload
      dispatch({ type: 'CREATE_ENTRY', payload: response.data });
      // Catch errors
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
        setEmptyFields(error.response.data.emptyFields);
      } else {
        setError('An error occurred while processing your request');
      }
    }
    // When the try/catch block completes, toggle the NewEntry section closed
    toggle();
  };

  return (
    <div className='NewEntry'>
      {/* Button next to 'New Meditation' that toggles the NewEntry section open/closed */}
      <div className='newEntryHeader'>
        <button onClick={toggle}>+</button>
        {/* Displays either the date or 'New Meditation' based on the toggle state */}
        <p>{date}</p>
      </div>
      {/* Form container for the textarea and buttons */}
      <div className='form'>
        {/* Render the following content only if the 'open' state is true */}
        {open && (
          // Toggle container for the NewEntry form
          <div className='toggle'>
            {/* Form for submitting a new entry */}
            <form method='post' onSubmit={handleSubmit}>
              <textarea className='entryText' id='body' name='body' rows={10} cols={30} onChange={e => setBody(e.target.value)} value={body} />
              <div className='newEntryButtons'>
                <input className='cancel' type='button' onClick={toggle} value='Cancel'></input>
                <input className='save' type='submit' value='Save'></input>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewEntry;
