//** HOME PAGE */

import React from 'react';

// Import the EntryContainer component
import EntryContainer from '../components/EntryContainer.jsx';

/**
 * Home component represents the main page of the application.
 * It renders the EntryContainer component, which displays journal entries.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  return (
    // Main container for the Home component
    <div className='main'>
      {/* EntryContainer component renders and manages journal entries */}
      <EntryContainer />
    </div>
  );
}

export default Home;
