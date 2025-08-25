import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;