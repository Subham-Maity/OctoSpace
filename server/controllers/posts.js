import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */

// Defining a function for creating a new post
export const createPost = async (req, res) => {
    try {
        // Getting the user ID, description, and picture path from the request body
        const { userId, description, picturePath } = req.body;

        // Finding the user with the same ID in the database using the User model
        const user = await User.findById(userId);

        // Creating a new post with the user ID, name, location, description, picture paths, and other fields
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });

        // Saving the new post in the database
        await newPost.save();

        // Finding all the posts in the database using the Post model
        const post = await Post.find();

        // Sending back a 201 status code and all the posts as JSON
        res.status(201).json(post);
    } catch (err) {
        // Handling any errors and sending back a 409 status code and the error message as JSON
        res.status(409).json({ message: err.message });
    }
};

/* READ */

// Defining a function for getting all the posts in the feed
export const getFeedPosts = async (req, res) => {
    try {
        // Finding all the posts in the database using the Post model
        const post = await Post.find();

        // Sending back a 200 status code and all the posts as JSON
        res.status(200).json(post);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};

// Defining a function for getting a user's posts by ID
export const getUserPosts = async (req, res) => {
    try {
        // Getting the user ID from the request parameters
        const { userId } = req.params;

        // Finding all the posts with the same user ID in the database using the Post model
        const post = await Post.find({ userId });

        // Sending back a 200 status code and all the posts as JSON
        res.status(200).json(post);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */

// Defining a function for liking or unliking a post by IDs
export const likePost = async (req, res) => {
    try {
        // Getting the post ID from the request parameters
        const { id } = req.params;

        // Getting the user ID from the request body
        const { userId } = req.body;

        // Finding the post with the same ID in the database using the Post model it's for grabbing the post's information
        const post = await Post.findById(id);

        // Checking if the user has already liked the post in the likes map of the post object
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            // If yes, deleting the user from the likes map of the post object using delete method
            post.likes.delete(userId);
        } else {
            // If not, adding the user to the likes map of the post object using set method with a value of true
            post.likes.set(userId, true);
        }

        // Updating the post in the database with its updated likes map using findByIdAndUpdate method
        // Passing { new: true } option to get back the updated document instead of the original one
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        // Sending back a 200 status code and the updated post as JSON
        res.status(200).json(updatedPost);
    } catch (err) {
        // Handling any errors and sending back a 404 status code and the error message as JSON
        res.status(404).json({ message: err.message });
    }
};
