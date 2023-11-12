import React from 'react';
import { useState, useEffect } from 'react';
import PastEntry from './PastEntry';
import '../scss/pastEntriesFeed.scss';

const PastEntriesFeed = props => {
  // GET AND RENDER PAST ENTRIES
  const [entries, updateEntries] = useState([]);

  useEffect(() => {
    fetch('/entries')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        updateEntries(data);
      })
      .catch(error => console.error('Error:', error));
  }, [entries]);

  const pastEntries = entries.map((entry, i) => {
    return <PastEntry entry={props.entry} body={entry.body} date={entry.createdAt} id={entry._id} key={i} />;
  });

  // REVERSE PAST ENTRIES SO RECENT IS AT TOP
  pastEntries.reverse();

  return (
    <div>
      <p className='pastMeditationTitle'>Past Meditation Sessions</p>
      {pastEntries}
    </div>
  );
};

export default PastEntriesFeed;
