// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { render } from 'react-dom';
// import App from './components/App';

// // uncomment so that webpack can bundle styles
// import styles from './scss/app.scss';

// const root = createRoot(document.querySelector('#root'));
// root.render(<App />);

import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './components/App';
import { onLCP, onFID, onCLS } from 'web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
onCLS(console.log);
onFID(console.log);
onLCP(console.log);
