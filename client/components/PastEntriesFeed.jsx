import React from 'react';
import PastEntry from './PastEntry';
import '../scss/pastEntriesFeed.scss';

const PastEntriesFeed = ({ entries }) => {
  const pastEntries = entries.map((entry, i) => (
    <PastEntry entry={entry} body={entry.body} date={entry.createdAt} id={entry._id} key={i} />
  ));

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
