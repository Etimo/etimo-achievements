import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const container = document.getElementById('root');

ReactDOM.render(element, container);
