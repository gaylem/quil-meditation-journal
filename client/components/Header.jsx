import React from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../scss/header.scss';
import hamburger from '../../public/assets/hamburger.png';

function Header() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    logout(refreshToken);
  };
  return (
    <div className='header'>
      <div className='header-container'>
          <img className='hamburger' src={hamburger} alt='hamburger-menu' />
        <h1>quil</h1>
          <div className='logout'>{user && <button onClick={handleClick}>Log Out</button>}</div>
        </div>
      </div>
  );
}

export default Header;
