import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const container = document.getElementById('root');

ReactDOM.render(element, container);
