import React, { use } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    
    setUserData({
      fullName:{
        firstName: firstName,
        lastName: lastName
      },
      email: email,
      password: password
    })

    // console.log('User Data:', userData);

    // Reset form fields after submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  }
    

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-3' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <form onSubmit={submitHandler}>
            
            <h3 className='text-lg font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-6'>
              <input  
              required
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2  text-lg placeholder:text-base'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text" 
              placeholder='Firstname' />

              <input 
              required
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text" 
              placeholder='Lastname' />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input 
            required
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder='email@example.com' />
            
            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            
            <input 
            required 
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-lg'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            placeholder='password' />

            <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg placeholder:text-lg'>Login</button>
            <p className='text-center'>Already have account?<Link to={'/login'} className='text-blue-600'>Login here</Link></p>
        </form>
      </div>

      <div>
        <p className='text-xs'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span>
         and <span className='underline'>Terms of Service apply</span></p>
      </div>
    </div>
  )
}

export default UserSignup