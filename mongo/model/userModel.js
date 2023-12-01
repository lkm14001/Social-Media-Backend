const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:String,
    firstName:String,
    lastName:String,
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    email:String,
    password:String,
    profilePicture:String,
    bio:String,
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    sentFriendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]
},{collection:'Users',timestamps:true})


UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User',UserSchema)
module.exports = User;