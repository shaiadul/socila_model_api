/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *      
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               name: "New User"
 *               email: "newuser@example.com"
 *       400:
 *         description: Bad request, invalid user data
 *       500:
 *         description: Internal server error
 */


import  express  from "express";
import { createUser } from "../controller/userController.js";

const userRoutes = express.Router();

// post request for create user
userRoutes.post('/create', createUser);

export default userRoutes;