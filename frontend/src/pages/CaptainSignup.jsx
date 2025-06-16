import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainSignup = () => {

  const navigate=useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});

  const [vehicleColor,setVehicleColor] = useState('');
  const [vehiclePlate,setVehiclePlate] = useState('');
  const [vehicleCapacity,setVehicleCapacity] = useState('');
  const [vehicleType,setVehicleType] = useState('');
  
  
  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
      
    const captainData={
      fullname:{
        firstname: firstName,
        lastname: lastName
        },
        email: email,
        password: password,
        vehicle:{
          color:vehicleColor,
          plate:vehiclePlate, 
          capacity:vehicleCapacity,
          vehicleType:vehicleType
        }
      }

      const response= await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,captainData)
      if(response.status==201){
        const data=response.data
        setCaptain(data.captain)
        localStorage.setItem('token',data.token)
        navigate('/captain-home')
      }

    
      // Reset form fields after submission
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setVehicleColor(''),
      setVehiclePlate(''),
      setVehicleCapacity(''),
      setVehicleType('')
    }
  return (
    <div className='px-5 py-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
        <form onSubmit={submitHandler}>
            
            <h3 className='text-lg w-full font-medium mb-2'>What's your name Captain</h3>
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

            <h3 className='text-lg font-medium mb-2'>What's your email Captain</h3>
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

            <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <input
                required
                className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-base'
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                type="text"
                placeholder='Vehicle Color'
              />
              <input
                required
                className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-base'
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                type="text"
                placeholder='Vehicle Plate'
              />
              <input
                required
                className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-base'
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                type="number"
                placeholder='Vehicle Capacity'
              />
              <select
                required
                className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base'
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="" disabled>Select Vehicle</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg placeholder:text-lg'>Create Captain Account</button>
            <p className='text-center'>Already have account?<Link to={'/captain-login'} className='text-blue-600'>Login here</Link></p>
        </form>
      </div>

      <div>
        <p className='text-xs'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span>
         and <span className='underline'>Terms of Service apply</span></p>
      </div>
    </div>
  )
}

export default CaptainSignup
