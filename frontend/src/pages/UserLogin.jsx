import React from 'react'
import { Link } from 'react-router-dom'
import { useState,useContext } from 'react';
import {UserDataContext} from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const userData={
      email: email,
      password: password
    }

    const response =await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token',data.token); // Store user data in localStorage
      navigate('/start');
    }
    
    console.log('User Data:', userData);

    // Reset form fields after submission
    setEmail('');
    setPassword('');
  }
  
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <form onSubmit={submitHandler}>
            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
            required
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email" 
            placeholder='email@example.com' />
            
            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            
            <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password" 
            placeholder='password' />

            <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg placeholder:text-base'>Login</button>
            <p className='text-center'>New here?<Link to={'/signup'} className='text-blue-600'>Create New Account</Link></p>
        </form>
      </div>

      <div>
        <Link to={'/captain-login'} className='bg-green-500 text-white flex items-center justify-center font-semibold mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'>Sign In As Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin