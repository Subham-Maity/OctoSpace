import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
//when someone hits the /:id/like endpoint means
// if someone hit abc/posts/123/like here 123 is the id,
// we will run the likePost function which will like the
// post by id after checking if the post already exists
router.patch("/:id/like", verifyToken, likePost);

export default router;
