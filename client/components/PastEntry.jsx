// Import React, useState, and contexts
import React, { useState } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext';

// Import styles
import '../scss/pastEntry.scss';

// Import moment to format entry dates
import moment from 'moment';

// Import axios to handle server requests for entries data
import axios from '../axiosConfig';

// Import props validation
import PropTypes from 'prop-types';

/**
 * PastEntry component renders an individual past journal entry.
 * It allows the user to toggle the display, delete the entry, and edit the entry.
 *
 * @param {Object} entry - The individual entry to be rendered.
 */
const PastEntry = ({ entry }) => {
  // Destructure entry properties
  const { _id, createdAt, body } = entry;

  // Retrieve dispatch and user information from contexts
  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  // useState hooks for managing component state
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(body);

  // Function to toggle the entry open and closed and manage editing state
  const toggle = () => {
    setOpen(!open);
    setIsEditing(false);
  };

  // Format the date of the past entry
  const formattedDate = moment(createdAt).format('dddd, LL');

  // Function to handle deleting an entry
  const handleDelete = async () => {
    try {
      // Send DELETE request to the server to delete the entry
      await axios.delete(`/api/entries/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });

      // Fetch updated entries after deletion
      const response = await axios.get(`/api/entries`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });

      // Update entries in the context
      dispatch({ type: 'SET_ENTRIES', payload: response.data });
      toggle();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  // Helper function to update the entry with a PATCH request when user saves an edit
  const updateEntryWithPatch = async () => {
    try {
      await axios.patch(
        `/api/entries/${_id}`,
        { body: editedBody, userId: user.userId },
        {
          headers: {
            Authorization: `Bearer ${user.token.accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error('Error updating entry with PATCH request:', error);
      // Re-throw the error to be caught by the outer try-catch block
      throw error;
    }
  };

  // Helper function to fetch updated entries after editing
  const fetchUpdatedEntries = async () => {
    try {
      // Fetch updated entries from the server
      const updatedResponse = await axios.get(`/api/entries`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });
      // Update entries in the context
      dispatch({ type: 'SET_ENTRIES', payload: updatedResponse.data });
    } catch (error) {
      console.error('Error fetching updated entries:', error);
      // Re-throw the error to be caught by the outer try-catch block
      throw error;
    }
  };

  // Function to handle editing an entry
  const handleEdit = async () => {
    try {
      // Update the entry with a PATCH request
      await updateEntryWithPatch();
      // Fetch updated entries after editing
      await fetchUpdatedEntries();
      // Toggle the entry closed
      toggle();
    } catch (error) {
      console.error('Error editing entry:', error);
    }
  };

  // Render the PastEntry component
  return (
    <div key={_id} className='PastEntry'>
      {/* Header with button and formatted date */}
      <div className='buttonHeaderPast'>
        <button onClick={toggle}>+</button>
        <p>{formattedDate}</p>
      </div>
      <div>
        {open && (
          <div className='toggle-container'>
            {/* Render either a textarea for editing or a paragraph for displaying the entry body */}
            {isEditing ? <textarea className='pastEntryText' value={editedBody} onChange={e => setEditedBody(e.target.value)} /> : <p className='pastEntryText'>{body}</p>}
            {/* Buttons for delete and edit actions */}
            <div className='pastEntryButtons'>
              <input className='delete' type='submit' onClick={handleDelete} value='Delete' />
              {isEditing ? <input className='edit' type='submit' onClick={handleEdit} value='Save' /> : <input className='edit' type='submit' onClick={() => setIsEditing(true)} value='Edit' />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for the PastEntry component
PastEntry.propTypes = {
  entry: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default PastEntry;
