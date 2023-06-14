import bcrypt from "bcrypt";// for hashing password before saving to database
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



