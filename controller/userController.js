import Mailgen from "mailgen";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt, { hash } from "bcrypt";
import User from "../model/userModels.js";


const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
    },
  });

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
        // -----------------------
        // node mailer setup
        // -----------------------
        const config = {
            service: "gmail",
            auth: {
                user: `${process.env.APP_EMAIL}`,
                pass: `${process.env.APP_EMAIL_PASSWORD}`,
            },
        };

        const transporter = nodemailer.createTransport(config);
      
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "OlaDev Social Media",
                link: `oladev.com.bd`,
            },
        });

        const email = {
            body: {
                name: req.body.name,
                intro: "Welcome to OlaDev Social Media ! We're very excited to have you on board.",
                action: {
                    instructions: "To get started with OlaDev Social Media, please click here:",
                    button: {
                        color: "#22BC66", // Optional action button color
                        text: "Confirm your account",
                        link: `http://localhost:3000/confirm/${req.body.email}`,
                    },
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
        };

        const emailBody = mailGenerator.generate(email);

        const message = {
            from: `${process.env.APP_EMAIL}`,
            to: req.body.email,
            subject: "Welcome to OlaDev Social Media",
            html: emailBody,
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(500).json({message: err.message});
                return process.exit(1);
            }
            res.status(200).json({message: "Email sent successfully !", "message_id": info.messageId});
        }
        );

        // -----------------------
        // node mailer setup end
        // -----------------------

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
