import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthContextProvider } from './context/AuthContext';
import { EntriesContextProvider } from './context/EntryContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EntriesContextProvider>
        <App />
      </EntriesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
