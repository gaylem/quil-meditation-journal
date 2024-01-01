//** APP COMPONENT */

import React, { lazy, Suspense } from 'react';

// Import BrowserRouter for managing page routes and navigation
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load internal components
const LazyHeader = lazy(() => import('./components/Header.jsx'));
const LazyHome = lazy(() => import('./components/Home.jsx'));
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
      {/* Set up the application routes using BrowserRouter */}
      <BrowserRouter>
        {/* Render the Header component for navigation */}
        <Suspense fallback={<div>Loading...</div>}>
          <LazyHeader />
          {/* Container for individual pages */}
          <div className='pages'>
            {/* Define the routes for the application */}
            <Routes>
              {/* Home route */}
              <Route path='/' element={<LazyHome />} />
            </Routes>
          </div>
          <LazyFooter />
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
