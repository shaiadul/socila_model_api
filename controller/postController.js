import Post from "../model/postModels.js";
import User from "../model/userModels.js";

export const createPost = async (req, res) => {
    try {
        const postData = await new Post(req.body);
        const saveData = await postData.save();
        res.status(200).json(saveData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const like = async  (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const postExist = await Post.findById(postId);
        const userExist = await User.findById(userId);

        if(!postExist){
            res.status(400).json({message: "Post not found"});
        }
        if(!userExist){
            res.status(400).json({message: "User not found"});
        }
        if(postExist.likesBy.includes(userId)){
            res.status(400).json({message: "already liked this post"});
        }
        if(postExist.dislikesBy.includes(userId)){
            postExist.dislikesBy.pull(userId);
            postExist.dislikes -= 1;
        }

        postExist.likesBy.push(userId);
        postExist.likes += 1;

        const saveLikes = await postExist.save();
        res.status(200).json(saveLikes);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const dislike = async  (req, res) =>{
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const postExist = await Post.findById(postId);
        const userExist = await User.findById(userId);

        if(!postExist){
            res.status(400).json({message: "Post not found"});
        }
        if(!userExist){
            res.status(400).json({message: "User not found"});
        }
        if(postExist.dislikesBy.includes(userId)){
            res.status(400).json({message: "already disliked this post"});
        }
        if(postExist.likesBy.includes(userId)){
            postExist.likesBy.pull(userId);
            postExist.likes -= 1;
        }

        postExist.dislikesBy.push(userId);
        postExist.dislikes += 1;

        const saveDisLike = await postExist.save();
        res.status(200).json(saveDisLike);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}