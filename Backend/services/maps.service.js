const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    
    if (!apiKey) {
        console.error('Google Maps API key is not set');
        throw new Error('Google Maps API key is not configured');
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log('Fetching coordinates for address:', address);

    try {
        const response = await axios.get(url);
        console.log('Geocoding response status:', response.data.status);
        
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            console.log('Coordinates found:', location);
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Geocoding failed:', response.data.status, response.data.error_message);
            throw new Error(`Unable to fetch coordinates: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error in getAddressCoordinate:', error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km
    try {
        const captains = await captainModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, ltd] // [longitude, latitude]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            },
            socketId: { $exists: true, $ne: null } // Only captains with active socket connections
        });

        console.log(`Found ${captains.length} captains within ${radius}km radius`);
        return captains;
    } catch (error) {
        console.error('Error finding captains in radius:', error);
        return [];
    }
}