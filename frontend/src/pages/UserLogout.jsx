import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const UserLogout = () => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status === 200) {
            localStorage.removeItem('token'); // Remove token from localStorage
            navigate('/login'); // Redirect to login page
        }
    }).catch((error) => {
        console.error("Logout failed:", error);
    })


  return (
    <div>UserLogout</div>
  )
}
export default UserLogout;

