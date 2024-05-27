const Mongoose = require("mongoose")
const MONGO_URL = process.env.MONGO_URL
const dbConnect = () => {
    const connect = Mongoose.connect(MONGO_URL)
    console.log("Database is connected successfully!");
}

module.exports = dbConnect;