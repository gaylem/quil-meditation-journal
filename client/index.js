//** INDEX.JS */

/**
 * Entry point of the quil application.
 * Initializes the main App component and provides necessary context providers.
 */

// Import React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';

// Import the main App component
import App from './App.jsx';
import './scss/main.scss';

// Create a root element using ReactDOM.createRoot
const root = createRoot(document.getElementById('root'));

/**
 * Render the main application within React.StrictMode.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
