import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';

import Header from '../components/Header';
import axios from '../axiosConfig';
import '../../client/scss/login-signup';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async e => {
    e.preventDefault();

    await signup(email, password);

    // try {
    //   await axios
    //     .post('/api/users/signup', {
    //       username,
    //       email,
    //       password,
    //     })
    //     .then(res => {
    //       if (res.data == 'exist') {
    //         alert('User already exists');
    //       } else if (res.data == 'notexist') {
    //         history('/home', { state: { email: email } });
    //       }
    //     })
    //     .catch(e => {
    //       alert('wrong details');
    //       console.log(e);
    //     });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <div className='App'>
      <Header />
      <div className='login-signup'>
        <h1>Signup</h1>

        <form onSubmit={handleSubmit}>
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
          <button disabled={isLoading}>Sign Up</button>
          {error && <div className='error'>{error}</div>}
          <p>
            Already have an account? <Link to='/'>Sign in!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
