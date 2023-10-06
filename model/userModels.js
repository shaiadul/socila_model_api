import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    status: {type: String, enum: ["active", "inative"], default: "inative"},
})

export default mongoose.model("User", userSchema);