const mongoose = require("mongoose");

let informationSchema = new mongoose.Schema({

    informationName: {
        type: String,
        required: true,
    },
    informationDetail: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Information', informationSchema);
