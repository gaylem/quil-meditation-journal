import React, { useState } from 'react';
import '../scss/newEntry.scss';
import { useEntriesContext } from '../hooks/useEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from '../axiosConfig';
import moment from 'moment';

function NewEntry() {
  const now = moment();
  const [date, setDate] = useState('New Meditation');
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
    setDate(open ? now.format('LL') : 'New Meditation');
  };

  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();

  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const userId = user.userId;

    const entry = { body, userId };
    console.log('entry : ', entry );

    try {
      const response = await axios.post('/api/entries', entry, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setBody('');
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_ENTRY', payload: response.data });
      console.log('Current entries state:', entries);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
        setEmptyFields(error.response.data.emptyFields);
      } else {
        setError('An error occurred while processing your request');
      }
    }

    toggle();
  };

  return (
    <div className='NewEntry'>
      <div className='buttonHeader'>
        <button onClick={toggle}>+</button>
        <p>{date}</p>
      </div>
      <div className='form'>
        {open && (
          <div className='toggle'>
            <form method='post' onSubmit={handleSubmit}>
              <textarea className='entryText' id='body' name='body' rows={10} cols={30} onChange={e => setBody(e.target.value)} value={body} />
              <div className='newEntryButtons'>
                <input id='cancel' type='submit' onClick={toggle} value='Cancel'></input>
                <input id='save' type='submit' value='Save'></input>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewEntry;
