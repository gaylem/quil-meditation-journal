import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import '../../client/scss/login-signup';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async e => {
    e.preventDefault();
    await signup(username, email, password);
  };

  return (
    <div className='App'>
      <div className='login-signup'>
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <h1 className='title'>Tranquility awaits...</h1>
            <input
              type='username'
              onChange={e => {
                setUsername(e.target.value);
              }}
              placeholder='Username'
              value={username}
            />
            <input
              type='email'
              onChange={e => {
                setEmail(e.target.value);
              }}
              placeholder='Email'
              value={email}
            />
            <input
              type='password'
              onChange={e => {
                setPassword(e.target.value);
              }}
              placeholder='Password'
              value={password}
            />
            <button className='login-signup-btn' disabled={isLoading}>
              Sign Up
            </button>
            {error && <div className='error'>{error}</div>}
            <p>
              Already have an account? <Link to='/'>Sign in!</Link>
            </p>
          </form>
        </div>
        <div className='about'>
          <div className='paragraph'>
            <p>quil is inspired by the words "tranquil" and "quill," as in the classic feather pen. Sign up or log in to discover your own dedicated space, where you can chronicle each step of your meditation journey.</p>
          </div>
          <div>
            <p>Every entry you record in your account is treated with the utmost security, employing robust encryption to ensure absolute privacy and confidentiality. Put your mind at ease and your worries aside, and immerse yourself fully in the transformative experience of meditation. We hope we can help your innermost thoughts find a safe harbor amid the turbulant waves of life.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
