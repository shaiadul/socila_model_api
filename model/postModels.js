import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    likesBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    dislikesBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
})

export default mongoose.model("Post", postSchema);