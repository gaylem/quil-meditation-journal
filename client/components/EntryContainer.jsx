//** ENTRY CONTAINER COMPONENT */

import React from 'react';

// Import componentsgit 
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
      {/* PastEntriesFeed component for displaying previous journal entries */}
      <PastEntriesFeed />
    </div>
  );
}

export default EntryContainer;
