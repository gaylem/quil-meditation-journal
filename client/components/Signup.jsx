import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from '../axiosConfig';
import '../scss/login-signup.scss';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const history = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post('/users/signup', {
          username,
          email,
          password,
        })
        .then(res => {
          if (res.data == 'exist') {
            console.log('then');
            alert('User already exists');
          } else if (res.data == 'notexist') {
            history('/home', { state: { id: email } });
          }
        })
        .catch(e => {
          alert('wrong details');
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='App'>
      <Header />
      <div className='login-signup'>
        <h1>Signup</h1>

        <form action='POST'>
          <input
            type='username'
            onChange={e => {
              setUsername(e.target.value);
            }}
            placeholder='Username'
          />
          <input
            type='email'
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder='Email'
          />
          <input
            type='password'
            onChange={e => {
              setPassword(e.target.value);
            }}
            placeholder='Password'
          />
          <button type='submit' onClick={submit}>Sign Up</button>
          <p>
            Already have an account? <Link to='/'>Sign in!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
