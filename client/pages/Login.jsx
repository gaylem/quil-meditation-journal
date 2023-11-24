import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import '../scss/login-signup.scss';

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
          {error && <div className='error'>{error}</div>}
          {/* Link to the signup page */}
          <p>
            Don&apos;t have an account? <Link to='/signup'>Sign up!</Link>
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

// Export the Login component as the default export
export default Login;
