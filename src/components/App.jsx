import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';

function App() {
  const [backendData, setBackendData] = useState({});

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=4LI6zdP9bsTQ8EtctAniacB3nVF7t2fceEa3SIgF')
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
      });
  }, []);

  return (
    <div>
      <p>is anyone home?</p>
      <p>{backendData.explanation}</p>
    </div>
  );
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);

export default App;
