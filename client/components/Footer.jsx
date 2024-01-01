//** FOOTER COMPONENT */

import React from 'react';

/**
 * Footer component
 *
 * @returns {JSX.Element} The rendered footer component.
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} quil meditation journal. All rights reserved.`;

  /**
   * Footer componenet
   *
   * @returns {JSX.Element} The rendered Footer component.
   */
  return (
    <footer>
      <div className='footer-container'>
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
