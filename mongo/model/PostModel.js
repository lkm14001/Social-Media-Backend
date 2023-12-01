const mongoose = require('mongoose')


const PostSchema = new mongoose.Schema({
    content:String,
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    image:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{collection:'Post',timestamps:true});

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;