import React from 'react';
import Header from '../components/Header';
import EntryContainer from '../components/EntryContainer';
import '../scss/app.scss';

function Home() {
  return (
    <div className='App'>
      <Header />
      <EntryContainer />
    </div>
  );
}

export default Home;
