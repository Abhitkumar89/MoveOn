import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Start = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user, setUser } = useContext(UserDataContext)

    useEffect(() => {
        console.log('User joining socket:', { userType: "user", userId: user._id });
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // Monitor localStorage for OTP changes (when captain ignores)
    useEffect(() => {
        const checkOTPStatus = () => {
            const currentOTP = localStorage.getItem('current-ride-otp');
            if (!currentOTP && waitingForDriver) {
                console.log('=== OTP CLEARED - CAPTAIN IGNORED RIDE ===');
                console.log('Returning user to find destination page...');
                
                // Clear pickup and destination inputs
                setPickup('');
                setDestination('');
                
                // Close all panels
                setWaitingForDriver(false);
                setVehicleFound(false);
                
                // Show message to user
                alert('Captain ignored the ride. Returning to find destination page.');
                
                // Navigate to find destination page
                navigate('/home');
            }
        };

        // Check every 2 seconds
        const intervalId = setInterval(checkOTPStatus, 2000);
        
        return () => clearInterval(intervalId);
    }, [waitingForDriver, navigate]);

    socket.on('ride-confirmed', ride => {
        console.log('Received ride-confirmed event:', ride);
        console.log('OTP received by user:', ride.otp);
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '65%',
                padding: 24,
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                duration: 0.3,
                ease: "power2.out"
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        try {
            console.log('=== CREATING RIDE ===');
            console.log('Creating ride with data:', { pickup, destination, vehicleType });
            console.log('User token:', localStorage.getItem('token'));
            console.log('Base URL:', import.meta.env.VITE_BASE_URL);
            console.log('User ID:', user?._id);
            
            // Validate required fields
            if (!pickup || !destination || !vehicleType) {
                throw new Error('Missing required fields: pickup, destination, or vehicleType');
            }
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not logged in. Please login again.');
            }
            
            // Check if user context is available
            if (!user || !user._id) {
                console.log('User not available, creating test user...');
                // For testing, create a simple user object
                const testUser = {
                    _id: '68c5abadb4f8816b1ca24f08', // Use the same ID as captain for testing
                    fullname: { firstname: 'Test', lastname: 'User' }
                };
                // Set the test user
                setUser(testUser);
                return;
            }
            
            console.log('Sending ride creation request...');
            
            // Generate random 6-digit OTP
            const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store OTP in localStorage so captain can access it
            localStorage.setItem('current-ride-otp', randomOTP);
            
            // Create a mock ride for testing
            const mockRide = {
                _id: 'ride_' + Date.now(),
            pickup,
            destination,
                fare: fare[vehicleType],
                otp: randomOTP, // Random OTP
                user: {
                    _id: user._id,
                    fullname: { firstname: 'Test', lastname: 'User' }
                },
                captain: {
                    _id: '68c5abadb4f8816b1ca24f08',
                    fullname: { firstname: 'Captain', lastname: 'Name' },
                    vehicle: { plate: 'ABC123' }
                }
            };
            
            console.log('=== MOCK RIDE CREATED ===');
            console.log('Mock ride created:', mockRide);
            console.log('OTP stored in localStorage:', randomOTP);
            console.log('localStorage current-ride-otp:', localStorage.getItem('current-ride-otp'));
            
            // Move to looking for driver state
            setConfirmRidePanel(false);
            setVehicleFound(true);
            
            // Simulate captain receiving the ride after 2 seconds
            setTimeout(() => {
                console.log('Simulating captain receiving ride...');
                // This will trigger the ride-confirmed event
                setVehicleFound(false);
                setWaitingForDriver(true);
                setRide(mockRide);
            }, 2000);
            
        } catch (error) {
            console.error('=== ERROR CREATING RIDE ===');
            console.error('Error creating ride:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
            
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to create ride: ${errorMessage}`);
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[40%] min-h-[280px] sm:min-h-[320px] p-4 sm:p-6 bg-white relative'>
                    <h4 className='text-xl sm:text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-4' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 sm:h-20 w-1 top-[50%] -translate-y-1/2 left-4 sm:left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-10 sm:px-12 py-2 sm:py-3 text-base sm:text-lg rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-gray-300'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-10 sm:px-12 py-2 sm:py-3 text-base sm:text-lg rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-3 sm:py-4 rounded-lg mt-6 sm:mt-8 w-full text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound}
                    setVehiclePanel={setVehiclePanel}
                    setWaitingForDriver={setWaitingForDriver}
                    setPickup={setPickup}
                    setDestination={setDestination} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                    setPickup={setPickup}
                    setDestination={setDestination} />
            </div>
        </div>
    )
}

export default Start