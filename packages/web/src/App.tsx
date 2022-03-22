import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/public/Home';
import Login from './views/public/Login';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <SideMenu />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </React.StrictMode>
  );
};

export default App;
