import React from 'react';
import { useState, useEffect } from 'react';
import NewEntry from './NewEntry';
import PastEntriesFeed from './PastEntriesFeed';
import '../scss/entryContainer.scss';

function EntryContainer() {
  const [entries, setEntries] = useState([]);

  // Fetch entries when the component mounts
  useEffect(() => {
    fetch('/entries')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setEntries(data);
      })
      .catch(error => console.error('Error:', error));
  }, [entries]);

  // Function to update entries when a new entry is added
//   const updateEntries = newEntry => {
//     setEntries([...entries, newEntry]);
//   };

  return (
    <div className='EntryContainer'>
      <div className='quote-block'>
        <p id='quote'>Listening to and understanding our inner sufferings will resolve most of the problems we encounter.</p>
        <p id='author'>Thich Nhat Hanh</p>
      </div>
      <NewEntry updateEntries={updateEntries} />
      <hr />
      <PastEntriesFeed entries={entries} />
    </div>
  );
}

export default EntryContainer;
