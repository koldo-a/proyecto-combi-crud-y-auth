import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

/* ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
); */
const root = document.getElementById('root');

// Wrap the App component inside createRoot
const rootElement = (
  <Router>
    <App />
  </Router>
);

// Use createRoot to render the root element
ReactDOM.createRoot(root).render(rootElement);