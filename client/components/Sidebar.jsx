//** SIDEBAR COMPONENT */

import React from 'react';
import { Link } from 'react-router-dom';

// Import close button icon
import circle from '../../public/assets/images/close-button.png';
import gear from '../../public/assets/images/gear.png';
import brain from '../../public/assets/images/brain.png';
import question from '../../public/assets/images/question.png';
import feather from '../../public/assets/images/feather.png';
import smiley from '../../public/assets/images/smiley.png';

// Import props validation
import PropTypes from 'prop-types';

/**
 * Sidebar component for internal navigation links.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Indicates whether the sidebar is open.
 * @param {function} props.toggleSidebar - Function to toggle the sidebar open/closed.
 * @returns {JSX.Element} Sidebar component.
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Determine the appropriate CSS class based on the sidebar state
  const sidebarClass = isOpen ? 'sidebar open' : 'sidebar';

  return (
    <div className={sidebarClass}>
      {/* Close button to toggle the sidebar closed */}
      <img src={circle} onClick={toggleSidebar} className='closeBtn' alt='Button that closes sidebar navigation panel' />
      <div className='sidebar-content'>
        {/* Link to the 'About' page */}
        <div className='link'>
          <img src={feather} className='icon' id='gear' alt='feather icon' />
          <Link to='/about-quil' onClick={toggleSidebar}>
            About quil
          </Link>
        </div>
        <div className='link'>
          <img src={brain} className='icon' id='gear' alt='brain icon' />
          <Link to='/how-to-meditate' onClick={toggleSidebar}>
            How to Meditate
          </Link>
        </div>
        <div className='link'>
          <img src={question} className='icon' id='gear' alt='queation mark icon' />
          <Link to='/help-faqs' onClick={toggleSidebar}>
            Help & FAQs
          </Link>
        </div>
        <div className='link'>
          <img src={smiley} className='icon' id='gear' alt='smiley face icon' />
          <Link to='/get-involved' onClick={toggleSidebar}>
            Get Involved
          </Link>
        </div>
        <div className='link'>
          <img src={gear} className='icon' id='gear' alt='gear icon' />
          <Link to='/account' onClick={toggleSidebar}>
            Account
          </Link>
        </div>
      </div>
    </div>
  );
};

//PropTypes for the Sidebar component
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
