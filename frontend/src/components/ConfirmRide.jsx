import React from 'react'
import { useNavigate } from 'react-router-dom'

const ConfirmRide = (props) => {
    const navigate = useNavigate()

    const handleCancelRide = () => {
        // Clear pickup and destination inputs
        if (props.setPickup) {
            props.setPickup('')
        }
        if (props.setDestination) {
            props.setDestination('')
        }
        
        // Reset all panel states
        props.setConfirmRidePanel(false)
        props.setVehiclePanel(false)
        props.setVehicleFound(false)
        props.setWaitingForDriver(false)
        // Navigate to home
        navigate('/home')
    }

    return (
        <div className='h-full flex flex-col'>
            <h3 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-5'>Confirm your Ride</h3>

            <div className='flex-1 flex flex-col items-center justify-between'>
                <div className='w-full'>
                    <img className='h-16 sm:h-20 mx-auto mb-4 sm:mb-5' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='w-full'>
                        <div className='flex items-center gap-3 sm:gap-5 p-2 sm:p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill"></i>
                            <div>
                                <h3 className='text-base sm:text-lg font-medium'>562/11-A</h3>
                                <p className='text-xs sm:text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 sm:gap-5 p-2 sm:p-3 border-b-2'>
                            <i className="text-base sm:text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-base sm:text-lg font-medium'>562/11-A</h3>
                                <p className='text-xs sm:text-sm -mt-1 text-gray-600'>{props.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 sm:gap-5 p-2 sm:p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-base sm:text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                                <p className='text-xs sm:text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-4 sm:mt-6 flex gap-2 sm:gap-3'>
                    <button onClick={handleCancelRide} className='flex-1 bg-gray-200 text-gray-800 font-semibold py-3 sm:py-4 rounded-lg text-base sm:text-lg hover:bg-gray-300 transition-colors'>
                        Cancel Ride
                    </button>
                    <button onClick={() => {
                        props.setVehicleFound(true)
                        props.setConfirmRidePanel(false)
                        props.createRide()

                    }} className='flex-1 bg-green-600 text-white font-semibold py-3 sm:py-4 rounded-lg text-base sm:text-lg hover:bg-green-700 transition-colors'>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRide