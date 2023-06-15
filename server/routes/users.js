import express from "express";

import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";

import {verifyToken} from "../middleware/auth.js";


//this will create a new router object which we can use to define our routes
const router = express.Router();

/* READ */
//when someone hits the /:id endpoint means if someone hit abc/users/123 here 123 is the id, we will run the getUser function which will get the user by id after checking if the user already exists
//we are using the verifyToken middleware to verify the token
//This is read operation so the database will not be changed
router.get("/:id", verifyToken, getUser);

//when someone hits the /:id/friends endpoint means if someone hit abc/users/123/friends here 123 is the id, we will run the getUserFriends function which will get the user friends by id after checking if the user already exists
//we are using the verifyToken middleware to verify the token
//This is read operation so the database will not be changed
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
//when someone hits the /:id endpoint means if someone hit abc/users/123 here 123 is the id, we will run the updateUser function which will update the user by id after checking if the user already exists
//we are using the verifyToken middleware to verify the token
//This is update operation so the database will be changed
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
