import React from 'react';
import Header from './Header';
import EntryContainer from './EntryContainer';
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
