//** ENTRY CONTAINER COMPONENT */

import React from 'react';
import PastEntriesFeed from './PastEntriesFeed.jsx';
import Timer from './Timer.jsx';
import '../scss/entry-container.scss';

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
    <div className='entry-container'>
      {/* TimerBox that contains the meditation Timer component */}
      <div className='timer-box'>
        <Timer />
      </div>
      {/* PastEntriesFeed component for displaying previous journal entries */}
      <div>
        <PastEntriesFeed />
      </div>
    </div>
  );
}

export default EntryContainer;
