//** INDEX.JS */

/**
 * Entry point of the quil application.
 * Initializes the main App component and provides necessary context providers.
 */

// Import React and ReactDOM
import React from 'react';
const { createRoot } = await import('react-dom/client');

// Import the main App component
import App from './App.jsx';
import './scss/main.scss';

// Import context providers for authentication and entries
import { AuthContextProvider } from './context/AuthContext.jsx';
import { EntriesContextProvider } from './context/EntryContext.jsx';

// Create a root element using ReactDOM.createRoot
const root = createRoot(document.getElementById('root'));

/**
 * Render the main application within React.StrictMode.
 * The app is wrapped with AuthContextProvider and EntriesContextProvider
 * to provide authentication and entries context, respectively.
 */
root.render(
  <React.StrictMode>
    {/* Use AuthContextProvider to provide authentication context */}
    <AuthContextProvider>
      {/* Use EntriesContextProvider to provide entries context */}
      <EntriesContextProvider>
        {/* Render the main App component */}
        <App />
      </EntriesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
