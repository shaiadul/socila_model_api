import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    status: {type: String, enum: ["active", "inative"], default: "inative"},
    verified: {type: Boolean, default: false},
    profileImage: {type: String, default: ""},
    coverImage: {type: String, default: ""},
    profession: {type: String, default: ""},
    location: {type: String, default: ""},
    bio: {type: String, default: ""},
    relationship: {type: String, enum: ["single", "married", "divorced", "complicated"], default: "single"},    
    friendList: {type: Array, unique:true, default: [0]},
})

export default mongoose.model("User", userSchema);