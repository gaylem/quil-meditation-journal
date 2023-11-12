import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import EntryContainer from './EntryContainer';
import '../scss/app.scss';

function Home() {
  const location = useLocation();

  return (
    <div className='App'>
      <Header />
      <EntryContainer />
    </div>
  );
}

export default Home;
