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

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Add this for local Vite development
    'https://move-on-inky.vercel.app', // Add your current frontend URL
    'https://move-on-git-main-abhit-kumars-projects.vercel.app',
    'https://move-on-eight.vercel.app',
    'https://move-iq66a5lfc-abhit-kumars-projects.vercel.app',
    'https://move-oxeb0nytj-abhit-kumars-projects.vercel.app',
    'https://move-iv4iewhgz-abhit-kumars-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
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