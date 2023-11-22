// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../scss/sidebar.scss';

const Sidebar = ({ isOpen }) => {
  const sidebarClass = isOpen ? 'sidebar open' : 'sidebar';
  return (
    <div className={sidebarClass}>
      <div className='sidebar-content'>
        <Link to='/about'>About</Link>
      </div>
    </div>
  );
};

export default Sidebar;
