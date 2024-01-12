//** APP COMPONENT */

import React, { lazy, Suspense, useState, useEffect } from 'react';

// Import BrowserRouter for managing page routes and navigation
const { BrowserRouter, Routes, Route, Navigate } = await import('react-router-dom');

// Import useAuthContext hook for user authentication
import { useAuthContext } from './hooks/useAuthContext.js';

// Lazy load internal components
const LazyHeader = lazy(() => import(/* webpackChunkName: "header" */ './components/Header.jsx'));
const LazyHome = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home.jsx'));
const LazyLogin = lazy(() => import(/* webpackChunkName: "login" */ './pages/Login.jsx'));
const LazySignup = lazy(() => import(/* webpackChunkName: "signup" */ './pages/Signup.jsx'));
const LazyAbout = lazy(() => import(/* webpackChunkName: "about" */ './pages/About.jsx'));
const LazyMeditation = lazy(() => import(/* webpackChunkName: "meditation" */ './pages/Meditation.jsx'));
const LazyHelpFAQ = lazy(() => import(/* webpackChunkName: "help" */ './pages/HelpFAQ.jsx'));
const LazyCommunity = lazy(() => import(/* webpackChunkName: "community" */ './pages/Community.jsx'));
const LazyAccount = lazy(() => import(/* webpackChunkName: "account" */ './pages/Account.jsx'));
const LazyFooter = lazy(() => import(/* webpackChunkName: "footer" */ './components/Footer.jsx'));
const LazyNotFound = lazy(() => import(/* webpackChunkName: "not-found" */ './pages/NotFound.jsx'));

/**
 * Main application component that handles routing and rendering of pages.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  // Retrieve user information from the authentication context
  const { user } = useAuthContext();

  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const delayFooter = setTimeout(() => {
      setShowFooter(true);
    }, 6000); // Adjust the delay time (in milliseconds) as needed

    return () => clearTimeout(delayFooter); // Cleanup the timeout on component unmount
  }, []);

  return (
    // Main container for the application
    <div className='app-container'>
      {/* Set up the application routes using BrowserRouter */}
      <BrowserRouter>
        {/* Render the Header component for navigation */}
        <Suspense>
          <LazyHeader />
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
            {/* Community route - Renders Community page */}
            <Route path='/community' element={<LazyCommunity />} />
            {/* Account route - Renders Account page */}
            <Route path='/account' element={!user ? <LazyLogin /> : <LazyAccount />} />
            {/* Catch-all route for 404 */}
            <Route path='*' element={<LazyNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      {showFooter && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyFooter />
        </Suspense>
      )}
    </div>
  );
}

export default App;
