//** LOGIN PAGE */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin.js';
import Blurb from '../components/Blurb.jsx';

/**
 * Login component represents the login page of the application.
 *
 * It allows users to log in using their username and password.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  // State variables to manage username, password, and login-related state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  /**
   * Handles the form submission for user login.
   *
   * @param {Event} e - The submit event.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    // Main login and signup container
    <div className='loginSignupContainer'>
      {/* Box containing the login form */}
      <div className='box'>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <h1 className='title'>Welcome back!</h1>
          {/* Username input */}
          <input type='username' onChange={e => setUsername(e.target.value)} placeholder='Username' value={username} />
          {/* Password input */}
          <input type='password' onChange={e => setPassword(e.target.value)} placeholder='Password' value={password} />
          {/* Login button */}
          <button className='loginSignupBtn' type='submit' disabled={isLoading}>
            Log in
          </button>
          {/* Display error message if there is an error */}
          {error && <div className='error-message'>{error}</div>}
          {/* Link to the signup page */}
          <p>
            Don&apos;t have an account? <Link to='/signup'>Sign up!</Link>
          </p>
        </form>
      </div>
      <Blurb />
    </div>
  );
}

export default Login;
