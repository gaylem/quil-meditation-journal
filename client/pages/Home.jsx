// Import React and EntryContainer 
import React from 'react';
import EntryContainer from '../components/EntryContainer.jsx';

// Import styles
import '../scss/app.scss';

/**
 * Home component represents the main page of the application.
 * It renders the EntryContainer component, which displays journal entries.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  return (
    // Main container for the Home component
    <div className='App'>
      {/* EntryContainer component renders and manages journal entries */}
      <EntryContainer />
    </div>
  );
}

// Export the Home component as the default export
export default Home;
