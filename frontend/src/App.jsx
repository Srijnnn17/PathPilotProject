import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx'; // 1. Import the Header component

const App = () => {
  return (
    <>
      <Header /> {/* 2. Replace the old header with this component */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;