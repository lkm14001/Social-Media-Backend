const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment:String,
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{collection:'Comments',timestamps:true})

module.exports = mongoose.model('Comment',CommentSchema)