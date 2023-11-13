import React, { useState } from 'react';
import Header from './Header';
import axios from '../axiosConfig';
import '../scss/login-signup.scss';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/login', {
        username,
        password,
      });

      if (response.data) {
        const id = response.data;
        console.log(id);
        history(`/home`, { state: { id: id } });
      } else {
        alert('User has not signed up');
      }
    } catch (error) {
      alert('Wrong details');
      console.error(error);
    }
  }

  return (
    <div className='App'>
      <Header />

      <div className='login-signup'>
        <h1>Login</h1>

        <form onSubmit={submit}>
          <input type='username' onChange={e => setUsername(e.target.value)} placeholder='Username' />
          <input type='password' onChange={e => setPassword(e.target.value)} placeholder='Password' />
          <button type='submit'>Login</button>
          <p>
            Don't have an account? <Link to='/signup'>Sign up!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
