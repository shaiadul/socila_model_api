import  express  from "express";
import { createPost, dislike, like } from "../controller/postController.js";

const postRoutes = express.Router();

// post request for create post
postRoutes.post('/create', createPost);
postRoutes.post('/like/:postId/:userId', like);
postRoutes.post('/dislike/:postId/:userId', dislike)


export default postRoutes;