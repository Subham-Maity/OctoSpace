import bcrypt from "bcrypt";// for hashing password before saving to the database
import jwt from "jsonwebtoken";// for generating token for authentication

import User from "../models/User.js";

//  register user
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt();// generate salt for hashing password and saving to the database
        const passwordHash = await bcrypt.hash(password, salt); // hash password before saving to the database

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,// save hashed password to the database
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),// generate random number for viewedProfile
            impressions: Math.floor(Math.random() * 10000),// generate random number for impressions
        });
        const savedUser = await newUser.save();// save user to the database
        res.status(201).json(savedUser); // send saved user to the client
    } catch (err) {
        res.status(500).json({error: err.message});// catch error if any and send to the client
    }
}

// Logging in (routes\auth.js)
export const login = async (req, res)=>{
    try{
        // Get the email and password from the request body means from the client side we grab the email and password when user login
        const { email, password } = req.body;

        // Find the user with the same email in the database using the User model using mongoose
        const user = await User.findOne({ email: email });

        // If no user is found, send back a 400 status code and a message means if user is not registered then send error
        if (!user) return res.status(400).json({msg: "User does not exist"});

        // Compare the password from the request with the hashed password in the database using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);//user.password means hashed password that is saved in the database with the user enter password

        // If the passwords do not match, send back a 400 status code and a message
        if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});

        // Generate a token using jwt, using the user ID and the secret key from the environment variables as arguments
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET) // user._id means user id that is saved in the database

        // Delete the password from the user object to avoid sending it back to the client
        delete user.password; // delete password from the user object

        // Send back a 200 status code and the token and the user data as JSON
        res.status(200).json({token, user}); // send token and user data to the client

    }catch(err){
        // Handle any errors and send back a 500 status code and the error message as JSON
        res.status(500).json({ error: err.message });
    }
}



