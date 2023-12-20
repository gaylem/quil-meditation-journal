import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup.js';
import Blurb from '../components/Blurb.jsx';

/**
 * Signup component represents the signup page of the application.
 *
 * It allows users to create a new account by providing a username, email, and password.
 *
 * @returns {JSX.Element} The rendered Signup component.
 */
function Signup() {
  // State variables to manage username, email, password, and signup-related state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extract functions from useSignup hook
  const { signup, error, isLoading } = useSignup();

  /**
   * Handles the form submission for user signup.
   *
   * @param {Event} e - The submit event.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    // Call the signup function from the hook to initiate the signup process
    await signup(username, email, password);
  };

  return (
    <div className='loginSignupContainer'>
      {/* Box containing the signup form */}
      <div className='box'>
        {/* Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <h1 className='title'>Tranquility awaits...</h1>
          <div className='input-box'>
            {/* Username input */}
            <label for='username'>Username:</label>
            <input
              type='username'
              id='username'
              onChange={e => {
                setUsername(e.target.value);
              }}
              placeholder='ex: jane'
              value={username}
            />
            {/* Email input */}
            <label for='email'>Email:</label>
            <input
              type='email'
              id='email'
              onChange={e => {
                setEmail(e.target.value);
              }}
              placeholder='ex: jane@example.com'
              value={email}
            />
            {/* Password input */}
            <label for='password'>Password:</label>
            <input
              type='password'
              id='password'
              onChange={e => {
                setPassword(e.target.value);
              }}
              placeholder='ex: sy&jZ9aVj3K!'
              value={password}
            />
          </div>
          {/* Signup button */}
          <button className='loginSignupBtn' disabled={isLoading}>
            Sign Up
          </button>
          <p className='account-emails'> You will only receive essential account-related emails.</p>
          <div className='message-container'>
            {/* Display error message if there is an error */}
            {error && (
              <div className='signup-error-message'>
                <p>{error.message}</p>
              </div>
            )}
            {/* Link to the signin page */}
            <p className='signup-signin-message'>
              Already have an account? <Link to='/'>Sign in!</Link>
            </p>
          </div>
        </form>
      </div>
      <Blurb />
    </div>
  );
}

export default Signup;
