import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Home from './views/public/Home';
import Login from './views/public/Login';

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
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
