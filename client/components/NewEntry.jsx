import React from 'react';
import '../scss/newEntry.scss';
import { useState } from 'react';
import { useEntriesContext } from '../hooks/useEntriesContext';
import axios from '../axiosConfig';
import moment from 'moment';

function NewEntry() {
  // TODAY'S DATE
  const now = moment();
  const [date, setDate] = useState('New Meditation');

  // TOGGLE
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
    setDate(open ? now.format('LL') : 'New Meditation');
  };

  const { dispatch } = useEntriesContext();
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    console.log('handleSubmit triggered'); // Add this line

    e.preventDefault();

    try {
      const response = await axios.post('/entries', { body });

      if (!response.data.ok) {
        setError(response.data.error);
      } else {
        const json = response.data;
        console.log('New entry data:', json);
        dispatch({ type: 'CREATE_ENTRY', payload: json });

        setBody('');
        console.log('new entry added', json);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request.');
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
