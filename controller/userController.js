import Mailgen from "mailgen";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt, { hash } from "bcrypt";
import User from "../model/userModels.js";



 const generateOtp = () => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

export const createUser = async (req, res) => {
    try { 
       
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = await new User({
            name: req.body.name, 
            email: req.body.email,
            password: hashedPassword,
            status: req.body.status,
            verified: req.body.verified,
            profileImage: req.body.profileImage,
            coverImage: req.body.coverImage,
            profession: req.body.profession,
            location: req.body.location,
            bio: req.body.bio,
            friendList: req.body.friendList
        });
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
                link: `oladev-v1.onrender.com`,
            },
        });

        const email = {
            body: {
                name: req.body.name,
                intro: "Welcome to OlaDev Social Media ! We're very excited to have you on board. ",
                action: {
                    instructions: "To get started with OlaDev Social Media, please click here:",
                    button: {
                        color: "#34495E", // action button color
                        text: "Confirm your account",
                        link: `https://crimson-anemone-vest.cyclic.app/api/v1/users/verified/${req.body.email}`,
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

export const verifiedUser = async (req, res) => {
    try {
        const person = await User.find({email: req.params.email});
        if(person && person.length > 0){
            const userData = await User.findByIdAndUpdate(person[0]._id, {verified: true}, {new: true});
            res.status(200).json(userData);
        }
        else{
            res.status(404).json({message: "User not found !"});
        }
    } catch (error) {
        res.status(401).json({message: error.message});
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const person = await User.findOne({ email: req.params.email });

        if (person) {

            const otp = generateOtp();
            res.cookie('passwordResetToken', otp, { maxAge: 900000, httpOnly: true });

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
                    link: `oladev-v1.onrender.com`,
                },
            });

            const email = {
                body: {
                    intro: "Welcome to OlaDev Social Media!",
                    action: {
                        instructions: "If you want to change your OlaDev Social Media password, please copy this code and paste it",
                        button: {
                            color: "#34495E",
                            text: `${otp}`,
                            link: `#`,
                        },
                    },
                    outro: "Need help or have questions? Just reply to this email; we'd love to help.",
                },
            };

            const emailBody = mailGenerator.generate(email);

            const message = {
                from: `${process.env.APP_EMAIL}`,
                to: req.params.email,
                subject: "Change password: OlaDev Social Media",
                html: emailBody,
            };

            await transporter.sendMail(message);

            res.status(200).json({ message: 'Password reset email sent. Please check your email.' });
        } else {
            res.status(404).json({ message: 'User not found please input a valid email' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const passwordResetToken = req.body.passwordResetToken;
        const newPassword = await bcrypt.hash(req.body.newPassword, 10);


        const storedToken = req.cookies.passwordResetToken;

        if (passwordResetToken === storedToken) {

            const email = req.body.email; 

            const user = await User.findOne({ email });

            if (user) {
                // Update the user's password
                user.password = newPassword;

                await user.save();
                res.clearCookie('passwordResetToken');
                res.status(200).json({ message: 'Password reset successful.' });
            } else {
                res.status(404).json({ message: 'User not found.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
            verified: req.body.verified,
            bio: req.body.bio,
            profession: req.body.profession,
            location: req.body.location,
            profileImage: req.body.profileImage,
            coverImage: req.body.coverImage,
            friendList: req.body.friendList,
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
