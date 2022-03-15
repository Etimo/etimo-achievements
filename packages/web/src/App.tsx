import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './views/public/Home';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </React.StrictMode>
  );
};

export default App;
