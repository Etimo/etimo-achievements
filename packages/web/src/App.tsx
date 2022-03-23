import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Home from './views/public/Home';
import Login from './views/public/Login';
import Profile from './views/public/Profile';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <div className="flex">
        <div className="flex-none">
          <SideMenu />
        </div>
        <div className="flex-auto p-4 mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/callback" element={<Login />} />
          </Routes>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
