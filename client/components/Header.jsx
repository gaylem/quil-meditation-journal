//** HEADER COMPONENT */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import useLogout hook and useAuthContext to manage logout and authentication.
import { useLogout } from '../hooks/useLogout.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

// Import hamburger icon
import hamburger from '../../public/assets/icons/hamburger.png';
import featherHeader from '../../public/assets/icons/feather-header.png';

// Import Sidebar component for navigation
import Sidebar from './Sidebar.jsx';

/**
 * Header component containing the application title, logout button, and sidebar menu button.
 *
 * @returns {JSX.Element} The rendered header component.
 */
function Header() {
  // useLogout hook is used to retrieve logout functionality.
  const { logout } = useLogout();

  // useAuthContext hook is used to retrieve user information for authentication.
  const { user } = useAuthContext();

  // useNavigate hook is used to redirect the user to either the homepage or login page when they click the title.
  const navigate = useNavigate();

  // handleClick function manages logout button clicks and refresh tokens in local storage.
  const handleLogoutBtnClick = () => {
    logout(user.userId);
    navigate('/login');
    if (sidebarOpen) toggleSidebar();
  };

  // State and function to manage sidebar open/closed behavior.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // toggleSidebar function toggles the sidebar open and closed.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Redirects user to either the homepage or login page when title is clicked
  const handleTitleClick = () => {
    if (user) {
      // If user is logged in, redirect to the homepage
      navigate('/');
      if (sidebarOpen) toggleSidebar();
    } else {
      // If user is not logged in, redirect to the login page
      navigate('/login');
    }
  };

  /**
   * Main header component, which contains:
   *
   * the hamburger menu icon that toggles the sidebar open and closed,
   * the app h1 title,
   * the username,
   * and a logout button that logs users out of their account
   *
   * @returns {JSX.Element} The rendered Header component.
   */
  return (
    <div className='header'>
      {/* Header container for hamburger menu, title, and logout button. */}
      <div className='headerContainer'>
        {/* Hamburger menu icon toggles the sidebar open and closed when clicked. */}
        <img className='hamburger' onClick={toggleSidebar} src={hamburger} alt='Button that opens sidebar navigation panel' />
        {/* Application title */}
        <h1 onClick={handleTitleClick}>
          quil
          <img src={featherHeader} />
        </h1>
        {/* Logout button is displayed if a user is logged in, and it logs the user out when clicked. */}

        {user && (
          <div className='auth-box'>
            <div className='user'>
              {/* Username */}
              <p> Hey, {user.username}!</p>
            </div>
            <div className='logout'>
              {/* Logout button */}
              <button onClick={handleLogoutBtnClick}>Log Out</button>
            </div>
          </div>
        )}
      </div>
      {/* Sidebar component for internal navigation links to other pages. */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
}

export default Header;
