import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from "../context/CaptainContext"; 
import axios from 'axios'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        // Reset all states when captain returns to home page
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(false);
        setRide(null);
        
        console.log('Captain joining socket:', {
            userId: captain._id,
            userType: 'captain'
        });
        
        // Activate captain when they visit home page
        const activateCaptain = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/activate`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('captain-token')}`
                    }
                });
                console.log('Captain activated successfully');
            } catch (error) {
                console.error('Error activating captain:', error);
            }
        };
        
        activateCaptain();
        
        // Check for ride request every 2 seconds
        const checkForRide = () => {
            const sharedOTP = localStorage.getItem('current-ride-otp');
            
            if (sharedOTP && !ridePopupPanel) {
                console.log('Found OTP in localStorage, creating ride request...');
                const mockRideRequest = {
                    _id: 'ride_' + Date.now(),
                    pickup: 'Test Pickup Location',
                    destination: 'Test Destination',
                    fare: 100,
                    otp: sharedOTP, // Same OTP as user
                    user: {
                        _id: 'user123',
                        fullname: { firstname: 'Test', lastname: 'User' }
                    }
                };
                console.log('Captain received ride with OTP:', sharedOTP);
                setRide(mockRideRequest);
                setRidePopupPanel(true);
            }
        };
        
        // Check immediately and then every 2 seconds
        checkForRide();
        const intervalId = setInterval(checkForRide, 2000);
        
        // Join socket
        console.log('Emitting join event for captain:', {
            userId: captain._id,
            userType: 'captain'
        });
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        // Add socket connection status listeners
        socket.on('connect', () => {
            console.log('Captain socket connected');
        });

        socket.on('disconnect', () => {
            console.log('Captain socket disconnected');
        });

        socket.on('error', (error) => {
            console.error('Captain socket error:', error);
        });

        // Set up socket event listeners
        const handleNewRide = (data) => {
            console.log('=== CAPTAIN RECEIVED NEW RIDE ===');
            console.log('Captain received new ride:', data);
            console.log('Setting ride popup panel to true');
            setRide(data)
            setRidePopupPanel(true)
        }


        // Add event listeners
        socket.on('new-ride', handleNewRide)


        // Location update function
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    console.log('Updating captain location:', position.coords);
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                }, (error) => {
                    console.error('Error getting location:', error);
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // Cleanup function
        return () => {
            clearInterval(intervalId);
            clearInterval(locationInterval)
            socket.off('new-ride', handleNewRide)
        }
    }, [captain._id, socket])


    async function confirmRide() {
        try {
            console.log('=== CAPTAIN CONFIRM RIDE FUNCTION CALLED ===');
            console.log('Captain confirming ride:', { rideId: ride._id, captainId: captain._id });
            
            // Mock ride confirmation for testing
            const mockConfirmedRide = {
                ...ride,
                otp: '123456', // Mock OTP
                captain: {
                    _id: captain._id,
                    fullname: { firstname: captain.fullname.firstname, lastname: captain.fullname.lastname },
                    vehicle: { plate: 'ABC123' }
                }
            };
            
            console.log('Mock ride confirmed:', mockConfirmedRide);
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
            
        } catch (error) {
            console.error('Error confirming ride:', error);
            alert('Failed to confirm ride. Please try again.');
        }
    }


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain/logout' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />

            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome