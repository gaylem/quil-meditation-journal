import React from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../scss/header.scss';
import hamburger from '../../public/assets/hamburger.png';
import PropTypes from 'prop-types';

function Header({ toggleSidebar }) {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = ({ toggleSidebar }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    logout(refreshToken);
  };
  return (
    <div className='header'>
      <div className='header-container'>
        <img className='hamburger' onClick={toggleSidebar} src={hamburger} alt='hamburger-menu' />
        <h1>quil</h1>
        <div className='logout'>{user && <button onClick={handleClick}>Log Out</button>}</div>
      </div>
    </div>
  );
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
