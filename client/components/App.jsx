// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

function App() {
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='App'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar className='main-content' isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
