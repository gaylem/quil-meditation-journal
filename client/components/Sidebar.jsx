// Import React from React and Link from react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';

// Import styles
import '../scss/sidebar.scss';

// Import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

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
      <FontAwesomeIcon onClick={toggleSidebar} className='close-button' icon={faCircleXmark} style={{ color: '#acacac' }} size='2xl' />

      {/* Sidebar content with internal navigation links */}
      <div className='sidebar-content'>
        {/* Link to the 'About' page */}
        <Link to='/about'>About</Link>
        {/* Add additional navigation links as needed */}
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
