import React from 'react';
import { createRoot } from 'react-dom/client';
// import { render } from 'react-dom';
import App from './components/App';

// uncomment so that webpack can bundle styles
import styles from './scss/app.scss';

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
