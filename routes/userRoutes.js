import  express  from "express";
import { createUser } from "../controller/userController.js";

const userRoutes = express.Router();

// post request for create user
userRoutes.post('/create', createUser);

export default userRoutes;