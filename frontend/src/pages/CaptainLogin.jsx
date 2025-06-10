import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';

const CaptainLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captainData, setCaptainData] = useState({});
    
    const submitHandler = (e) => {
      e.preventDefault();
      // Here you would typically handle the login logic, such as sending the email and password to your backend.
      // console.log('Email:', email);
      // console.log('Password:', password);
      
      setCaptainData({
        email: email,
        password: password
      });
      console.log('User Data:', userData);
  
      // Reset form fields after submission
      setEmail('');
      setPassword('');
    }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
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
            <p className='text-center'>Join a fleet?<Link to={'/captain-signup'} className='text-blue-600'>Register as a captain</Link></p>
        </form>
      </div>

      <div>
        <Link to={'/login'} className='bg-[#d5622d] text-white flex items-center justify-center font-semibold mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'>Sign In As User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin