import User from "../model/userModels.js";
import bcrypt, { hash } from "bcrypt";
import  Jwt  from "jsonwebtoken";

export const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = await new User({
            name: req.body.name, 
            email: req.body.email,
            password: hashedPassword,
            status: req.body.status,
        });
        const saveData = await userData.save();
        res.status(200).json(saveData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const loginUser = async (req, res) => {
    try {
        const person = await User.find({email: req.body.email});
        if(person && person.length > 0){
            const isValidPassword = await bcrypt.compare(req.body.password, person[0].password);
            if(isValidPassword){
                // jwt validation
                const token = Jwt.sign({email: person[0].email, id: person[0]._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

                res.status(200).json({message: "Login Successfull", "access_token": token});
            }else{
                res.status(401).json({message: "Invalid Password"});
            }
        }
        else{
            res.status(404).json({message: "Authentication Failed !"});
        }
    } catch (error) {
        res.status(401).json({message: error.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getUserById = async (req, res) => {
    try {
        const userData = await User.findById(req.params.id);
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const userData = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


export const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUserData = {
            name: req.body.name, 
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
