const Mongoose = require("mongoose")

const dbConnect = () => {
    const connect = Mongoose.connect("mongodb://root:password@pumipat.trueddns.com:63711/mongodb")
    console.log("Database is connected successfully!");
}

module.exports = dbConnect;