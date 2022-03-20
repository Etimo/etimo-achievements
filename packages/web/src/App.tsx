import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './views/public/Home';
import Login from './views/public/Login';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <div>
        <Menu>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </Menu>
      </div>
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
