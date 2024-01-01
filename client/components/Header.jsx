//** HEADER COMPONENT */

import React from 'react';
import featherHeader from '../../assets/images/feather-header.png';

/**
 * Header component containing the application title, logout button, and sidebar menu button.
 *
 * @returns {JSX.Element} The rendered header component.
 */
function Header() {
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
      {/* Application title */}
      <h1>
        quil
        <img src={featherHeader} />
      </h1>
      {/* Logout button is displayed if a user is logged in, and it logs the user out when clicked. */}

      {user && (
        <div className='auth-box'>
          <div className='logout'>
            {/* Logout button */}
            <button onClick={handleLogoutBtnClick}>Log Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
