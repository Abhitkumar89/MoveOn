const rideService = require('../services/ride.service.js');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service.js');
const { sendMessageToSocketId } = require('../socket.js');
const rideModel = require('../models/ride.model.js');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            console.error('User not authenticated:', req.user);
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        console.log('Creating ride with data:', { user: req.user._id, pickup, destination, vehicleType });
        
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        console.log('Ride created successfully:', ride);

        // Send response first
        res.status(201).json(ride);

        // Then handle captain notifications asynchronously
        try {
            // Use fallback coordinates if Google Maps API fails
            let pickupCoordinates;
            try {
                pickupCoordinates = await mapService.getAddressCoordinate(pickup);
                console.log('Pickup coordinates:', pickupCoordinates);
            } catch (geoError) {
                console.warn('Google Maps API failed, using fallback coordinates:', geoError.message);
                // Use Delhi coordinates as fallback
                pickupCoordinates = { ltd: 28.7041, lng: 77.1025 };
            }

            const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 10);
            console.log('Captains found:', captainsInRadius.length);

            const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
            console.log('Ride with user:', rideWithUser);

            if (captainsInRadius.length === 0) {
                console.log('No captains found in radius, trying to find any available captains');
                // Fallback: find any captain with socket connection
                const anyCaptains = await captainModel.find({
                    socketId: { $exists: true, $ne: null }
                });
                console.log('Found any captains:', anyCaptains.length);
                
                if (anyCaptains.length === 0) {
                    console.log('No captains available at all');
                    return;
                }
                
                // Use the first available captain
                const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
                console.log('=== SENDING RIDE TO ANY AVAILABLE CAPTAIN ===');
                console.log('Sending ride to any available captain:', anyCaptains[0]._id);
                console.log('Captain socketId:', anyCaptains[0].socketId);
                console.log('Ride data:', rideWithUser);
                
                sendMessageToSocketId(anyCaptains[0].socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
                console.log('Ride sent to any available captain');
                return;
            }

            captainsInRadius.forEach(captain => {
                console.log(`=== SENDING RIDE TO CAPTAIN ===`);
                console.log(`Sending ride to captain: ${captain._id}, socketId: ${captain.socketId}`);
                console.log(`Ride data:`, rideWithUser);
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
                console.log(`Ride sent to captain ${captain._id}`);
            });
        } catch (notificationError) {
            console.error('Error in captain notification process:', notificationError);
            // Don't fail the ride creation if notification fails
        }

    } catch (err) {
        console.error('Error creating ride:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        console.log('Ride confirmed by captain:', ride.captain._id);
        console.log('Ride data with OTP:', ride);
        console.log('User data:', ride.user);

        // Send ride confirmation to user (WITH OTP)
        if (!ride.user.socketId) {
            console.error('User socketId is missing!');
            return res.status(400).json({ message: 'User not connected' });
        }

        // Send confirmation to user (WITH OTP)
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride // Send full ride data including OTP to user
        })

        console.log('Ride confirmed and OTP sent to user:', ride.user.socketId);
        console.log('OTP sent to user:', ride.otp);

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        console.log('Starting ride with OTP:', { rideId, otp, captainId: req.captain._id });
        
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log('Ride started successfully:', ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error starting ride:', err);
        return res.status(400).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}