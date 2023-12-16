//** APP COMPONENT */

import React, { lazy, Suspense } from 'react';

// Import BrowserRouter for managing page routes and navigation
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import useAuthContext hook for user authentication
import { useAuthContext } from './hooks/useAuthContext.js';

// Lazy load internal components
const LazyHeader = lazy(() => import('./components/Header.jsx'));
const LazyHome = lazy(() => import('./pages/Home.jsx'));
const LazyLogin = lazy(() => import('./pages/Login.jsx'));
const LazySignup = lazy(() => import('./pages/Signup.jsx'));
const LazyAbout = lazy(() => import('./pages/About.jsx'));
const LazyMeditation = lazy(() => import('./pages/Meditation.jsx'));
const LazyHelpFAQ = lazy(() => import('./pages/HelpFAQ.jsx'));
const LazyGetInvolved = lazy(() => import('./pages/GetInvolved.jsx'));
const LazyAccount = lazy(() => import('./pages/Account.jsx'));
const LazyFooter = lazy(() => import('./components/Footer.jsx'));

/**
 * Main application component that handles routing and rendering of pages.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  // Retrieve user information from the authentication context
  const { user } = useAuthContext();

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
              {/* Home route - Renders Home page if the user is authenticated, otherwise redirects to the login page */}
              <Route path='/' element={user ? <LazyHome /> : <Navigate to='/login' />} />
              {/* Login route - Renders Login page if the user is not authenticated, otherwise redirects to the home page */}
              <Route path='/login' element={!user ? <LazyLogin /> : <Navigate to='/' />} />
              {/* Signup route - Renders Signup page if the user is not authenticated, otherwise redirects to the home page */}
              <Route path='/signup' element={!user ? <LazySignup /> : <Navigate to='/' />} />
              {/* About route - Renders About page */}
              <Route path='/about-quil' element={<LazyAbout />} />
              {/* Help route - Renders Help & FAQs page */}
              <Route path='/help-faqs' element={<LazyHelpFAQ />} />
              {/* Meditation route - Renders How to Meditate page */}
              <Route path='/how-to-meditate' element={<LazyMeditation />} />
              {/* Get Involved route - Renders Get Involved page */}
              <Route path='/get-involved' element={<LazyGetInvolved />} />
              {/* Account route - Renders Account page */}
              <Route path='/account' element={!user ? <LazyLogin /> : <LazyAccount />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
      <LazyFooter />
    </div>
  );
}

export default App;
