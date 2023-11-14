import React from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../scss/header.scss';

function Header() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };
  return (
    <div className='Header'>
      <div className='HeaderContents'>
        <img src='/assets/hamburger.png' alt='hamburger-menu' />
        <h1>quil</h1>
        <div className='logout'>{user && <button onClick={handleClick}>Log out</button>}</div>
      </div>
    </div>
  );
}

export default Header;
