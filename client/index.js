import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { EntriesContextProvider } from './context/EntriesContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EntriesContextProvider>
      <App />
    </EntriesContextProvider>
  </React.StrictMode>,
);
