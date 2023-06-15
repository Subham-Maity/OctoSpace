// Importing the User model
import User from "../models/User.js";

/* READ */

// Defining a function for getting a user by ID
export const getUser = async (req, res) => {
    try {
        // Getting the user ID from the request parameters
        //req. param() searches the URL path, body, and query string of the request (in that order) for the specified parameter.
        // If no parameter value exists anywhere in the request with the given name,
        // it returns undefined or the optional defaultValue if specified
        const { id } = req.params;

        // Finding the user with the same ID in the database using the User model
        // findById() is used to find a single document by its _id field
        const user = await User.findById(id);

        // Sending back a 200 status code and the user data as JSON
        res.status(200).json(user);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};

// Defining a function for getting a user's friends by ID
export const getUserFriends = async (req, res) => {
    try {
        // Getting the user ID from the request parameters
        const { id } = req.params;

        // Finding the user with the same ID in the database using the User model
        const user = await User.findById(id);

        // Finding all the friends of the user in the database using their IDs and the User model
        // Using Promise.all to wait for all the promises to resolve before sending back the data
        // Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises
        const friends = await Promise.all(
            // user.friends is an array of IDs of the user's friends' here map() method is used to map the array of IDs to an array of promises
            user.friends.map((id) => User.findById(id))
        );

        // Formatting the friend's data to only include some fields
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        // Sending back a 200 status code and the formatted friends data as JSON
        res.status(200).json(formattedFriends);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */

// Defining a function for adding or removing a friend by IDs
export const addRemoveFriend = async (req, res) => {
    try {
        // Getting the user ID and the friend ID from the request parameters
        const { id, friendId } = req.params;

        // Finding the user and the friend with the same IDs in the database using the User model
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // Checking if the user already has the friend in their friends array
        if (user.friends.includes(friendId)) {
            // If yes, removing the friend from both users' friends arrays using filter method
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // If not, adding the friend to both users' friends arrays using push method
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        // Saving both users in the database with their updated friends arrays weathers they are added or removed
        await user.save();
        await friend.save();

        // Finding all the friends of the user in the database using their IDs and the User model
        // Using Promise.all to wait for all the promises to resolve
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // Formatting the friend's data to only include some fields
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        // Sending back a 200-status code and the formatted friends data as JSON
        res.status(200).json(formattedFriends);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};
