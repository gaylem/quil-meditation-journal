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
          <div className='input-box'>
            {/* Username input */}
            <label htmlFor='username'>Username:</label>
            <input type='username' id='username' onChange={e => setUsername(e.target.value)} placeholder='ex: jane' value={username} />
            {/* Password input */}
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' onChange={e => setPassword(e.target.value)} placeholder='Enter your password' value={password} />
            {/* Login button */}
            <button className='form-btn' type='submit' disabled={isLoading}>
              Log in
            </button>
          </div>
          <div className='message-container'>
            {/* Display error message if there is an error */}
            {error && (
              <div className='error-message'>
                <p>{error}</p>
              </div>
            )}
            {/* Link to the signup page */}
            <p className='signup-signin-message'>
              Don&apos;t have an account? <Link to='/signup'>Sign up!</Link>
            </p>
          </div>
        </form>
      </div>
      <Blurb />
    </div>
  );
}

export default Login;
