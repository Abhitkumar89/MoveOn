import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainFinishRide = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const ride = location.state?.ride
    const { captain } = useContext(CaptainDataContext)

    const handleCompleteRide = () => {
        alert('Ride completed successfully! Returning to home page.')
        navigate('/captain-home')
    }

    return (
        <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">Ride Summary</h1>
                
                {/* Ride Details */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img 
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" 
                                src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" 
                                alt="User" 
                            />
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg capitalize">
                                    {captain.fullname.firstname + " " + captain.fullname.lastname}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Passenger</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl sm:text-2xl font-bold text-green-600">₹{ride?.fare || '100'}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Total Fare</p>
                        </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-sm sm:text-base">Pickup</p>
                                <p className="text-xs sm:text-sm text-gray-600">{ride?.pickup || 'Test Pickup Location'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-sm sm:text-base">Destination</p>
                                <p className="text-xs sm:text-sm text-gray-600">{ride?.destination || 'Test Destination'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete Ride Button */}
                <div className="mt-4 sm:mt-6">
                    <button 
                        onClick={handleCompleteRide}
                        className="w-full bg-green-600 text-white font-semibold py-3 sm:py-4 rounded-lg text-base sm:text-lg hover:bg-green-700 transition-colors"
                    >
                        Complete Ride
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CaptainFinishRide
