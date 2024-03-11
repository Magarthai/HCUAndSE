const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose.connect("mongodb://localhost:27017/HCU", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Database is connected successfully!");
        })
        .catch((error) => {
            console.error("Error connecting to database:", error);
        });
}

module.exports = dbConnect;
