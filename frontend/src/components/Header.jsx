import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <Link to='/'>PathPilot</Link>
        <div>
          {userInfo ? (
            <>
              <span>Welcome, {userInfo.name}</span>
              <button onClick={logoutHandler}>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login'>Sign In</Link>
              <Link to='/register'>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;