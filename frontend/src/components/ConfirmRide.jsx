import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div>
      <h5 onClick={()=>{
        props.setVehiclePanel(false);
      }} className='p-3 text-center w-[93%] absolute top-0'><i className="text-xl text-grey-300 ri-arrow-down-wide-line"></i></h5>
      <h3 className='text-2xl font-semibold mb-4'>Confirm your ride</h3>
      
      <div className='flex gap-2 justify-between flex-col items-center'>
        <img className='h-20' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1548646935/assets/64/93c255-87c8-4e2e-9429-cf709bf1b838/original/3.png" alt="" />

        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-user-fill"></i>
              <div>
                  <h3 className='text-lg font-medium'>562/11</h3>
                  <p className='text-sm -mt-1 text-grey-400'>Karampura, New Delhi</p>
              </div>
            </div>
            
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-user-line"></i>
              <div>
                  <h3 className='text-lg font-medium'>562/11</h3>
                  <p className='text-sm -mt-1 text-grey-400'>Karampura, New Delhi</p>
              </div>
            </div>

            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-fill"></i>
              <div>
                  <h3 className='text-lg font-medium'>₹193</h3>
                  <p className='text-sm -mt-1 text-grey-400'>Cash Cash</p>
              </div>
            </div>
        </div>

        <button onClick={()=>{
          props.setVehicleFound(true);
          props.setConfirmRidePanel(false);
        }}
        className='w-full mt-5 bg-green-400 text-white font-semibold p-2 rounded-lg'>Confirm</button>
      </div>

      

    </div>
  )
}

export default ConfirmRide