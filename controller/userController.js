import User from "../model/userModels.js";

export const createUser = async (req, res) => {
    try {
        const userData = await new User(req.body);
        const saveData = await userData.save();
        res.status(200).json(saveData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}