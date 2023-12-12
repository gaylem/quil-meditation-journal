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
          {/* Username input */}
          <input
            type='username'
            onChange={e => {
              setUsername(e.target.value);
            }}
            placeholder='Username'
            value={username}
          />
          {/* Email input */}
          <input
            type='email'
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder='Email'
            value={email}
          />
          {/* Password input */}
          <input
            type='password'
            onChange={e => {
              setPassword(e.target.value);
            }}
            placeholder='Password'
            value={password}
          />
          {/* Signup button */}
          <button className='loginSignupBtn' disabled={isLoading}>
            Sign Up
          </button>
          {/* Display error message if there is an error */}
          {error && <div className='error'>{error}</div>}
          {/* Link to the signin page */}
          <p>
            Already have an account? <Link to='/'>Sign in!</Link>
          </p>
        </form>
      </div>
      <Blurb />
    </div>
  );
}

export default Signup;
