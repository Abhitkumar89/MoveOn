// import React ,{useContext,useEffect} from 'react'
// import { UserDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'

// const UserProtectedWrapper = ({
//     children
// }) => {
//     const token = localStorage.getItem('token');
//     const navigate = useNavigate();

//     // Check if user is logged in
//     useEffect(() => {
//         if (!token) {
//             navigate('/login'); // Redirect to login if not authenticated
//         }
//     }, [token]);

//     return ( 
//         <>
//             {children}
//         </>
//     );
  
// }

// export default UserProtectedWrapper

import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login'); // redirect to login if no token
      return;
    }

    // Fetch user profile data
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.status === 200) {
        setUser(res.data.user); // assuming backend sends { user: {...} }
        setIsLoading(false);
      }
    })
    .catch((err) => {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token'); // Remove invalid token
      navigate('/login'); // Redirect on error
    });
  }, [token]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default UserProtectedWrapper;
