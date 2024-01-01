//** APP COMPONENT */

import React, { lazy, Suspense } from 'react';

// Import BrowserRouter for managing page routes and navigation
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load internal components
const LazyHeader = lazy(() => import('./components/Header.jsx'));
const LazyFooter = lazy(() => import('./components/Footer.jsx'));

/**
 * Main application component that handles routing and rendering of pages.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    // Main container for the application
    <div className='App'>
      <LazyHeader />
      <Timer />
      <LazyFooter />
    </div>
  );
}

export default App;
