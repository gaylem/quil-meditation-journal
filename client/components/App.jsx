// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from './Header';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import About from '../pages/About';

function App() {
  const { user } = useAuthContext();

  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <div className='pages'>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
            <Route path='/about' element={<About />} /> {/* Add a route for the About page */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
