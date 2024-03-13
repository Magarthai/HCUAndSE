const Mongoose = require("mongoose")

const dbConnect = () => {
    const connect = Mongoose.connect("mongodb+srv://Magar:Magarthai1@hcukmutt.xdi1ter.mongodb.net/HCU?retryWrites=true&w=majority&appName=HCUKMUTT")
    console.log("Database is connected successfully!");
}

module.exports = dbConnect;
