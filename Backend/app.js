const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDB = require('./db/db.js');
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');
const captainRoutes = require('./routes/captain.routes.js');
const mapRoutes = require('./routes/maps.routes.js');
const rideRoutes=require('./routes/ride.routes.js');

// Connect to MongoDB
connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ 
    message: 'MoveOn API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

//define the routes
app.use('/users',userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides',rideRoutes);

module.exports = app;