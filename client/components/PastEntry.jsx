import React, { useState } from 'react';
import '../scss/pastEntry.scss';
import moment from 'moment';
import axios from '../axiosConfig';

const PastEntry = ({ entry }) => {
  const { _id, createdAt, body } = entry;

  // TOGGLE ENTRY
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  // FORMAT DATE
  const formattedDate = moment(createdAt).format('LL');

  // HANDLE DELETE
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/entries/${_id}`);
      console.log(response.data); // Check the server response
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
          <div className='toggle'>
            <p className='pastEntryText'>{body}</p>
            <div className='pastEntryButtons'>
              <input id='cancel' type='submit' onClick={handleDelete} value='Delete'></input>
              <input id='save' type='submit' onClick={handleEdit} value='Edit'></input>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEntry;
