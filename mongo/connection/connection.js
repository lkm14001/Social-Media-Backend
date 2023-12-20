const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path:path.resolve(__dirname,'../../.env')})

const mongoURI = process.env.mongoURI
const mongoose = require('mongoose');


const makeConnection = async () => {
    const conn = await mongoose.connect(mongoURI.toString());
}

mongoose.connection
    .once('open', () => {
        console.log('MongoDB Connection Successfull');
    })
    .on('error', (err) => {
        console.log('Error Occured !!', err);
    })

module.exports = makeConnection;