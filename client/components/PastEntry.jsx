import React, { useState } from 'react';
import '../scss/pastEntry.scss';
import moment from 'moment';
import axios from '../axiosConfig';

const PastEntry = ({ entry, id }) => {
  // TOGGLE ENTRYå
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  // FORMAT DATE
  const createdDate = entry.createdAt;
  const formattedDate = moment(createdDate).format('LL');

  // HANDLE DELETE
  const handleDelete = async e => {
    e.preventDefault();

    try {
      const response = await axios.delete(`/api/entries/${id}`);
      console.log(response.data); // Check the server response
    } catch (error) {
      console.error('Error deleting entry:', error);
    }

    toggle();
  };

  // TODO: HANDLE EDIT - Button works when I have postman opened
  const handleEdit = e => {
    e.preventDefault();

    fetch(`api/entries/${id}`, {
      method: 'PATCH',
    })
      .then(res => {
        res.json();
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div key={entry._id} className='PastEntry'>
      <div className='buttonHeaderPast'>
        <button onClick={toggle}>+</button>
        <p>{formattedDate}</p>
      </div>
      <div>
        {open && (
          <div className='toggle'>
            <p className='pastEntryText'>{entry.body}</p>
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
