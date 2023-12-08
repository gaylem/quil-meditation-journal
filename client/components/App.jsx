// Import React and React Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import the useAuthContext hook to access authentication-related data and methods
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import internal components
import Header from './Header.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import About from '../pages/About.jsx';
import Meditation from '../pages/Meditation.jsx';

import '../scss/app.scss';

/**
 * Main application component that handles routing and rendering of pages.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  // Retrieve user information from the authentication context
  const { user } = useAuthContext();

  //TODO: Routes return 'Cannot GET /route' when visited directly, but on-page links work
  return (
    // Main container for the application
    <div className='App'>
      {/* Set up the application routes using BrowserRouter */}
      <BrowserRouter>
        {/* Render the Header component for navigation */}
        <Header />
        {/* Container for individual pages */}
        <div className='pages'>
          {/* Define the routes for the application */}
          <Routes>
            {/* Home route - Renders Home page if the user is authenticated, otherwise redirects to the login page */}
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            {/* Login route - Renders Login page if the user is not authenticated, otherwise redirects to the home page */}
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
            {/* Signup route - Renders Signup page if the user is not authenticated, otherwise redirects to the home page */}
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
            {/* About route - Renders About page */}
            <Route path='/about' element={<About />} /> {/* TODO: Add a route for the About page */}
            <Route path='/meditation' element={<Meditation />} /> {/* TODO: Add a route for the How to Meditate page */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
