//** ENTRY CONTAINER COMPONENT */

import React from 'react';

// Import components
import NewEntry from './NewEntry.jsx';
import PastEntriesFeed from './PastEntriesFeed.jsx';
import Timer from './Timer.jsx';

/**
 * EntryContainer - Main journal entry container that organizes new and past entries.
 *
 * This component serves as a container for both creating new journal entries and displaying
 * past entries in a feed. It also includes a meditation timer component.
 *
 * @returns {JSX.Element} The rendered EntryContainer component.
 */
function EntryContainer() {
  return (
    // Main EntryContainer component
    <div className='EntryContainer'>
      {/* TimerBox that contains the meditation Timer component */}
      <div className='TimerBox'>
        <Timer />
      </div>
      {/* NewEntry component for creating new journal entries */}
      <div className='NewEntryBox'>
        <NewEntry />
      </div>
      {/* Horizontal rule to visually separate new entries from past entries */}
      <hr />
      {/* PastEntriesFeed component for displaying previous journal entries */}
      <PastEntriesFeed />
    </div>
  );
}

export default EntryContainer;
