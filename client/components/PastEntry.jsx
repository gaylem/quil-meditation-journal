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
  console.log('PastEntry', user);

  // useState
  const [open, setOpen] = useState(false);

  // TOGGLE ENTRY
  const toggle = () => {
    setOpen(!open);
  };

  // FORMAT DATE
  const formattedDate = moment(createdAt).format('LL');

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
    } catch (error) {
      console.error('Error deleting entry:', error);
    }

    toggle();
  };

  // TODO: HANDLE EDIT - Button works when I have postman opened
  const handleEdit = () => {
    fetch(`api/entries/${_id}`, {
      method: 'PATCH',
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error));
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
            <p className='pastEntryText'>{body}</p>
            <div className='pastEntryButtons'>
              <input className='delete' type='submit' onClick={handleDelete} value='Delete' />
              <input className='edit' type='submit' onClick={handleEdit} value='Edit' />
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
