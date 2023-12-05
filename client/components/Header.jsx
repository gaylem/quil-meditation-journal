// React and hooks build the Header component and manage state
import React, { useState } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

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

  // useHistory hook is used to redirect the user to either the homepage or login page when they click the title
  const navigate = useNavigate();

  // handleClick function manages logout button clicks and refresh tokens in local storage.
  const handleLogoutBtnClick = () => {
    logout(user.userId);
    navigate('/login');
  };

  // State and function to manage sidebar open/closed behavior.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // toggleSidebar function toggles the sidebar open and closed.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  //
  const handleTitleClick = () => {
    if (user) {
      // Redirect to the homepage if the user is logged in
      navigate('/');
    } else {
      // Redirect to the login page if the user is not logged in
      navigate('/login');
    }
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
        <h1 onClick={handleTitleClick}>quil</h1>
        {/* Logout button is displayed if a user is logged in and logs the user out when clicked. */}

        {user && (
          <div className='auth-box'>
            <div className='user'>
              <p> Hey, {user.username}!</p>
            </div>
            <div className='logout'>
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
