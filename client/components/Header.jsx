import React, { useState } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../scss/header.scss';
import hamburger from '../../public/assets/hamburger.png';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

function Header() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    logout(refreshToken);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <div className='header'>
        <div className='header-container'>
          <img className='hamburger' onClick={toggleSidebar} src={hamburger} alt='hamburger-menu' />
          <h1>quil</h1>
          <div className='logout'>{user && <button onClick={handleClick}>Log Out</button>}</div>
        </div>
        <Sidebar className='main-content' isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}

export default Header;
