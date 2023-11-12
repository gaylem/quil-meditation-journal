import React from 'react';
import ReactDOM from 'react-dom/client';
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
