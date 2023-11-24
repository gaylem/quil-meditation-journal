import React, { useState } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import '../scss/pastEntry.scss';
import moment from 'moment';
import PropTypes from 'prop-types';
import axios from '../axiosConfig';

const PastEntry = ({ entry }) => {
  const { _id, createdAt, body } = entry;

  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  // useState
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(body);

  // TOGGLE ENTRY
  const toggle = () => {
    setOpen(!open);
    setIsEditing(false);
  };

  // FORMAT DATE
  const formattedDate = moment(createdAt).format('dddd, LL');

  // HANDLE DELETE
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/entries/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });

      const response = await axios.get(`/api/entries`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });

      dispatch({ type: 'SET_ENTRIES', payload: response.data });
      toggle();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  // TODO: HANDLE EDIT - Button works when I have postman opened
  const handleEdit = async () => {
    try {
      await updateEntryWithPatch();
      await fetchUpdatedEntries();
      toggle();
    } catch (error) {
      console.error('Error editing entry:', error);
    }
  };

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
      throw error; // Re-throw the error to be caught by the outer try-catch block
    }
  };

  const fetchUpdatedEntries = async () => {
    try {
      const updatedResponse = await axios.get(`/api/entries`, {
        headers: {
          Authorization: `Bearer ${user.token.accessToken}`,
        },
      });
      dispatch({ type: 'SET_ENTRIES', payload: updatedResponse.data });
    } catch (error) {
      console.error('Error fetching updated entries:', error);
      throw error; // Re-throw the error to be caught by the outer try-catch block
    }
  };

  return (
    <div key={_id} className='PastEntry'>
      <div className='buttonHeaderPast'>
        <button onClick={toggle}>+</button>
        <p>{formattedDate}</p>
      </div>
      <div>
        {open && (
          <div className='toggle-container'>
            {isEditing ? <textarea className='pastEntryText' value={editedBody} onChange={e => setEditedBody(e.target.value)} /> : <p className='pastEntryText'>{body}</p>}
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

PastEntry.propTypes = {
  entry: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default PastEntry;
