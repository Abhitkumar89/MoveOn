const socketIo = require('socket.io');
const userModel = require('./models/user.model.js');
const captainModel = require('./models/captain.model.js');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`User ${userId} joined with socket ${socket.id}`);
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`Captain ${userId} joined with socket ${socket.id}`);
                }
            } catch (error) {
                console.error('Error in join event:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.ltd] // [longitude, latitude]
                    }
                });
                console.log(`Updated location for captain ${userId}`);
            } catch (error) {
                console.error('Error updating captain location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Sending message to socketId:', socketId);
    console.log('Message object:', messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`Message sent to socket ${socketId}: ${messageObject.event}`);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };