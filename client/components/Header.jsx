// React and hooks build the Header component and manage state for sidebar, user logouts, and user authentication.
import React, { useState } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

// Import header styles
import '../scss/header.scss';

// The hamburger icon is imported from the assets folder.
import hamburger from '../../public/assets/hamburger.png';

// Internal Sidebar component is imported for navigation.
import Sidebar from './Sidebar';

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

  // handleClick function manages logout button clicks and refresh tokens in local storage.
  const handleClick = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    logout(refreshToken);
  };

  // State and function to manage sidebar open/closed behavior.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // toggleSidebar function toggles the sidebar open and closed.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Main header component containing the hamburger menu, title, and logout button.
   *
   * This component contains a button that toggles the sidebar open and closed, the app h1 title, and a logout button that logs users out of their account
   *
   * @returns {JSX.Element} The rendered Header component.
   */
  return (
    <div className='header'>
      {/* Header container for hamburger menu, title, and logout button. */}
      <div className='headerContainer'>
        {/* Hamburger menu icon toggles the sidebar open and closed when clicked. */}
        <img className='hamburger' onClick={toggleSidebar} src={hamburger} alt='hamburger-menu' />
        {/* Application title */}
        <h1>quil</h1>
        {/* Logout button is displayed if a user is logged in and logs the user out when clicked. */}
        <div className='logout'>{user && <button onClick={handleClick}>Log Out</button>}</div>
      </div>
      {/* Sidebar component for internal navigation links to other pages. */}
      <Sidebar className='mainContent' isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
}

export default Header;
