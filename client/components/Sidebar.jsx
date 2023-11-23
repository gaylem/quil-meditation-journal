// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../scss/sidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarClass = isOpen ? 'sidebar open' : 'sidebar';
  return (
    <div className={sidebarClass}>
      <FontAwesomeIcon onClick={toggleSidebar} className='close-button' icon={faCircleXmark} style={{ color: '#acacac' }} size='2xl' />
      <div className='sidebar-content'>
        <Link to='/about'>About</Link>
      </div>
    </div>
  );
};

export default Sidebar;
