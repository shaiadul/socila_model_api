
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the post
 *         content:
 *           type: string
 *           description: Content of the post
 */


/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and retrieval
 */

/**
 * @swagger
 * /api/posts/create:
 *   post:
 *     tags:
 *       - Posts
 *     description: Create a new post
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Post object
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Post'  # Reference the Post schema
 *     responses:
 *       200:
 *         description: Successfully created
 */


/**
 * @swagger
 * /api/posts/like/{postId}/{userId}:
 *   post:
 *     tags:
 *       - Posts
 *     description: Like a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the post to like
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the user liking the post
 *     responses:
 *       200:
 *         description: Successfully liked the post
 *       400:
 *         description: Error message if the post or user doesn't exist or if already liked
 */


/**
 * @swagger
 * /api/posts/dislike/{postId}/{userId}:
 *   post:
 *     tags:
 *       - Posts
 *     description: Dislike a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the post to dislike
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the user disliking the post
 *     responses:
 *       200:
 *         description: Successfully disliked the post
 *       400:
 *         description: Error message if the post or user doesn't exist or if already disliked
 */

import  express  from "express";
import { createPost, dislike, like } from "../controller/postController.js";

const postRoutes = express.Router();

// post request for create post
postRoutes.post('/create', createPost);
postRoutes.post('/like/:postId/:userId', like);
postRoutes.post('/dislike/:postId/:userId', dislike)


export default postRoutes;