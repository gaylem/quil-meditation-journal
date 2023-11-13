import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

import Header from '../components/Header';
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
      <Header />

      <div className='login-signup'>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input type='username' onChange={e => setUsername(e.target.value)} placeholder='Username' value={username} />
          <input type='password' onChange={e => setPassword(e.target.value)} placeholder='Password' value={password} />
          <button type='submit' disabled={isLoading}>
            Log in
          </button>
          {error && <div className='error'>{error}</div>}
          <p>
            Don't have an account? <Link to='/signup'>Sign up!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
