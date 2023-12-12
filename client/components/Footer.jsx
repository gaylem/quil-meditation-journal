//** HEADER COMPONENT */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import useAuthContext to manage logout and authentication.
import { useAuthContext } from '../hooks/useAuthContext.js';

/**
 * Footer component
 *
 * @returns {JSX.Element} The rendered footer component.
 */
function Footer() {
  // useAuthContext hook is used to retrieve user information for authentication.
  const { user } = useAuthContext();

  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} quil meditation journal. All rights reserved.`;

  /**
   * Footer componenet
   *
   * @returns {JSX.Element} The rendered Footer component.
   */
  return (
    <footer>
      <div className='footerContainer'>
        <div className='credits'>
          <strong>Credits:&nbsp;&nbsp;</strong>
          <a href='https://pixabay.com/sound-effects/singing-bowl-deep-sound-27532/'>Singing bowl audio</a> by Pixabay, <a href='https://fontawesome.com/icons'>icons</a> by FontAwesome, and <a href='https://fonts.google.com/'>fonts</a> by Google Fonts.
        </div>
        <div className='copyright'>
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
