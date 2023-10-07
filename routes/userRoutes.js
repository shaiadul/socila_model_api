/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password of the user
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
 *               password: "123456"
 *               status: "active"
 *       400:
 *         description: Bad request, invalid user data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login as an existing user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User credentials for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               user:
 *                 name: "User Name"
 *                 email: "user@example.com"
 *                 status: "active"
 *       400:
 *         description: Bad request, invalid credentials
 *       401:
 *         description: Unauthorized, invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/get:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/users/get/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/users/delete/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/users/update/{userId}:
 *   patch:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New user data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User' # Replace with the schema for user data
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


import  express  from "express";
import { createUser, deleteUserById, getAllUsers, getUserById, loginUser, updateUserById } from "../controller/userController.js";
import { checkLogin } from "../middlewares/checkLogin.js";

const userRoutes = express.Router();

userRoutes.post('/create', createUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/get', getAllUsers);
userRoutes.get('/get/:id', getUserById);
userRoutes.delete('/delete/:id', deleteUserById);
userRoutes.patch('/update/:id', updateUserById);

export default userRoutes;