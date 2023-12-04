// Imports
import React from 'react';
import NewEntry from './NewEntry';
import PastEntriesFeed from './PastEntriesFeed';
import Timer from './Timer';

// Import the styles for the EntryContainer
import '../scss/entryContainer.scss';

/**
 * EntryContainer - Main journal entry container that organizes new and past entries.
 *
 * This component serves as a container for both creating new journal entries and displaying
 * past entries in a feed. It also includes a quote block with an inspirational quote and its author.
 *
 * @returns {JSX.Element} The rendered EntryContainer component.
 */
function EntryContainer() {
  return (
    // Main EntryContainer component
    <div className='EntryContainer'>
      {/* Quote block with an inspirational quote and its author */}
      <div className='quoteBlock'>
        <Timer />
      </div>
      {/* NewEntry component for creating new journal entries */}
      <NewEntry />
      {/* Horizontal rule to visually separate new entries from past entries */}
      <hr />
      {/* PastEntriesFeed component for displaying previous journal entries */}
      <PastEntriesFeed />
    </div>
  );
}

export default EntryContainer;
