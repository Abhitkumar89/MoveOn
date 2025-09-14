import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        try {
            console.log('Captain submitting OTP:', { rideId: props.ride._id, otp });
            
            // OTP validation - check if OTP matches the ride's OTP
            if (otp === props.ride?.otp) {
                console.log('OTP is correct! Starting ride...');
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
                
                // Clear the OTP from localStorage
                localStorage.removeItem('current-ride-otp');
                
                // Navigate to finish ride page
                navigate('/captain-finish-ride', { state: { ride: props.ride } })
            } else {
                alert(`Invalid OTP. Please enter the correct OTP: ${props.ride?.otp}`);
            }
            
        } catch (error) {
            console.error('Error starting ride:', error);
            alert('Error starting ride. Please try again.');
        }
    }
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-4'>Complete the ride</h3>
            
            {/* OTP Input Section - Moved to top */}
            <div className='mb-6'>
                <form onSubmit={submitHander}>
                    <div className='mb-4'>
                        <label className='block text-lg font-semibold text-gray-700 mb-2'>Enter OTP from User:</label>
                        <div className='relative'>
                            <input 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                type="text" 
                                className='bg-white border-3 border-blue-600 px-6 py-5 font-mono text-2xl rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-600 text-center placeholder-gray-500 shadow-lg' 
                                placeholder='Enter 6-digit OTP' 
                                maxLength="6"
                                style={{ 
                                    fontSize: '28px', 
                                    letterSpacing: '6px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <div className='absolute inset-0 pointer-events-none border-2 border-dashed border-blue-300 rounded-lg opacity-50'></div>
                        </div>
                        <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mt-3'>
                            <p className='text-center text-sm font-semibold'>Ask the user for the OTP to complete the ride</p>
                        </div>
                    </div>

                    <button className='w-full mb-3 text-lg flex justify-center bg-green-600 text-white font-semibold p-4 rounded-lg hover:bg-green-700 transition-colors'>Complete Ride</button>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(false)
                        props.setRidePopupPanel(false)

                    }} className='w-full bg-red-600 text-lg text-white font-semibold p-4 rounded-lg hover:bg-red-700 transition-colors'>Cancel</button>

                </form>
            </div>

            <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4'>
                <p className='text-center text-sm font-semibold'>Ask the user for the OTP to start the ride</p>
                <p className='text-center text-xs mt-1'>The user will see the OTP on their screen</p>
            </div>
            
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mb-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            
            <div className='w-full'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp