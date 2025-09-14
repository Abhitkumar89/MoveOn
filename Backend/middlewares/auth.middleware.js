const userModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model.js');
const captainModel = require('../models/captain.model.js');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    console.log('Auth middleware - token:', token ? 'present' : 'missing');
    console.log('Auth middleware - authorization header:', req.headers.authorization);

    if (!token) {
        console.log('Auth middleware - no token found');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        console.log('Auth middleware - token is blacklisted');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - decoded token:', decoded);
        
        console.log('Auth middleware - searching for user ID:', decoded._id);
        const user = await userModel.findById(decoded._id);
        console.log('Auth middleware - found user:', user ? user._id : 'null');
        console.log('Auth middleware - user details:', user);

        if (!user) {
            console.log('Auth middleware - user not found in database');
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        return next();

    } catch (err) {
        console.log('Auth middleware - JWT verification failed:', err.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });



    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}