import React from 'react';
import '../scss/not-found.scss';

/**
 * Home component represents the main page of the application.
 * It renders the EntryContainer component, which displays journal entries.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
function NotFound() {
  return (
    // Main container for the Home component
    <div className='not-found-container'>
      <p className='code'>404</p>
      <p className='code-description'>The page you're looking for has discovered the principle of non-self.</p>
      <br />
      <p className='code-description-punchline'>It's anatta here.</p>
    </div>
  );
}

export default NotFound;
