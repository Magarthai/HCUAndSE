const Mongoose = require("mongoose")
require('dotenv').config();
const MONGO_URLs = process.env.MONGO_URL
const dbConnect = () => {
    const connect = Mongoose.connect(MONGO_URLs)
    console.log("Database is connected successfully!");
}

module.exports = dbConnect;