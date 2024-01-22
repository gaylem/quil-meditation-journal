//** SIGNUP PAGE */

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
  const { signup, error } = useSignup();

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
    <div className='login-signup-container'>
      {/* Box containing the signup form */}
      <div className='box'>
        {/* Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <h1 className='title'>Sign Up</h1>
          <div className='input-box'>
            {/* Username input */}
            <label htmlFor='username'>Username:</label>
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
            <label htmlFor='email'>Email:</label>
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
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              onChange={e => {
                setPassword(e.target.value);
              }}
              placeholder='Enter your password'
              value={password}
            />
          </div>
          {/* Signup button */}
          <button className='form-btn'>Sign Up</button>

          <div className='message-container'>
            {/* Display error message if there is an error */}
            {error && (
              <div className='error-message' id='login-signup-error'>
                <p>{error}</p>
              </div>
            )}
            {/* Link to the signin page */}
            <p className='signup-signin-message'>
              Already have an account? <Link to='/'>Log in!</Link>
            </p>
          </div>
        </form>
      </div>
      <Blurb />
    </div>
  );
}

export default Signup;
