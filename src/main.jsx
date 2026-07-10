import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import './index.scss';

const redirectPath = window.sessionStorage.getItem('spa-redirect');
if (redirectPath) {
  window.sessionStorage.removeItem('spa-redirect');
  window.history.replaceState(null, '', redirectPath);
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
