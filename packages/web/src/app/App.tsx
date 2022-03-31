import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import Login from '../features/auth/Login';
import LoginCallback from '../features/auth/LoginCallback';
import Logout from '../features/auth/Logout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';

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
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
