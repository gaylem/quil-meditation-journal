import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import '../scss/login-signup.scss';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async e => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className='App'>
      <div className='login-signup'>
        <div className='box'>
          <form onSubmit={handleSubmit}>
            <h1 className='title'>Welcome back!</h1>
            <input type='username' onChange={e => setUsername(e.target.value)} placeholder='Username' value={username} />
            <input type='password' onChange={e => setPassword(e.target.value)} placeholder='Password' value={password} />
            <button className='login-signup-btn' type='submit' disabled={isLoading}>
              Log in
            </button>
            {error && <div className='error'>{error}</div>}
            <p>
              Don't have an account? <Link to='/signup'>Sign up!</Link>
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

export default Login;
