const userModel = require('../models/user.model'); 
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;
        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await userModel.hashPassword(password);

        // Create and save the user
        const newUser = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword
        });

        // Fetch the saved user as a Mongoose document (with methods)
        const user = await userModel.findById(newUser._id);

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({ token, user });

    } catch (err) {
        next(err); // Pass to error handler middleware
    }
};
module.exports.loginUser = async (req, res,next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');// Ensure password is selected for comparison
    // console.log("User:", user);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password'});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();

    res.cookie('token', token, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        // maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.status(200).json({ token, user});   
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user); 
};

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token'); // Clear the cookie
    const token= req.cookies.token || req.headers.authorization.split(' ')[1];
    await blackListTokenModel.create({ token }); // Add token to blacklist
    res.status(200).json({ message: 'Logged out successfully' });
}