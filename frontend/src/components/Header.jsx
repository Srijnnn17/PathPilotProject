// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../slices/authSlice';

// const Header = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const logoutHandler = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   return (
//     <header>
//       <nav>
//         <Link to='/'>PathPilot</Link>
//         <div>
//           {userInfo ? (
//             <>
//               <span>Welcome, {userInfo.name}</span>
//               <button onClick={logoutHandler}>Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to='/login'>Sign In</Link>
//               <Link to='/register'>Sign Up</Link>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

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
    <header className='bg-gray-800 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-xl font-bold'>
          PathPilot
        </Link>
        <div className='flex items-center space-x-4'>
          {userInfo ? (
            <>
              <span className='font-medium'>Welcome, {userInfo.name}</span>
              <button
                onClick={logoutHandler}
                className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='hover:text-gray-300'>
                Sign In
              </Link>
              <Link to='/register' className='hover:text-gray-300'>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;