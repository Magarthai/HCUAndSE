const mongoose = require("mongoose");
const moment = require('moment-timezone');

function setToMidnight() {
    const thaiTime = moment().tz('Asia/Bangkok'); // Set timezone

    // Set time to midnight in 'Asia/Bangkok'
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    });

    // Return ISO string to ensure proper storage in MongoDB with correct timezone offset
    return thaiTime.toISOString(); // Converts to ISO 8601 format with timezone information
}

let feedbackSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
    },
    score2: {
        type: Number,
    },
    detail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: setToMidnight, // Default to midnight in 'Asia/Bangkok'
    },
    clinic: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    typeFeedback:  {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
