import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup.js';
import '../../client/scss/login-signup.scss';

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
      {/* About section */}
      <div className='about'>
        {/* First paragraph of about section */}
        <div className='paragraph'>
          <p>quil is inspired by the words &quot;tranquil&quot; and &quot;quill,&quot; as in the classic feather pen. Sign up or log in to discover your own dedicated space, where you can chronicle each step of your meditation journey.</p>
        </div>
        {/* Second paragraph of about section */}
        <div>
          <p>Every entry you record in your account is treated with the utmost security, employing robust encryption to ensure absolute privacy and confidentiality. Put your mind at ease and your worries aside, and immerse yourself fully in the transformative experience of meditation. We hope we can help your innermost thoughts find a safe harbor amid the turbulent waves of life.</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
