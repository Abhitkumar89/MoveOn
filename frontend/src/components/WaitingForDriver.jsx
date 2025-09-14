import React from 'react'
import { useNavigate } from 'react-router-dom'

const WaitingForDriver = (props) => {
  const navigate = useNavigate();
  
  const handleRideCompleted = () => {
    console.log('=== USER CLICKED RIDE COMPLETED ===');
    console.log('Clearing OTP from localStorage...');
    
    // Clear the OTP from localStorage
    localStorage.removeItem('current-ride-otp');
    
    // Clear pickup and destination inputs
    if (props.setPickup) {
      props.setPickup('');
    }
    if (props.setDestination) {
      props.setDestination('');
    }
    
    // Close the waiting for driver panel
    props.setWaitingForDriver(false);
    props.setVehicleFound(false);
    
    console.log('Navigating to /home...');
    alert('Ride completed! Returning to find a ride page.');
    
    // Add a small delay to allow panel to close, then navigate
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };
  
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.waitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      <div className='flex items-center justify-between'>
        <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname.firstname}</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
          <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
          <h1 className='text-3xl font-bold text-green-600'>OTP: {props.ride?.otp}</h1>
          <p className='text-sm text-gray-600'>Share this OTP with your driver</p>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
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
        
        <div className='w-full mt-6'>
          <button 
            onClick={handleRideCompleted}
            className='w-full bg-green-600 text-white font-semibold py-4 rounded-lg text-lg hover:bg-green-700 transition-colors'
          >
            Ride Completed
          </button>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver