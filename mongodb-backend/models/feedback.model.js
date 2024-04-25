const mongoose = require("mongoose");
const moment = require('moment-timezone');

function setToMidnight() {
    const today = new Date();
    const thaiTime = moment().tz(today, 'Asia/Bangkok'); // Set timezone

    // Set time to midnight in 'Asia/Bangkok'
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    });

    return thaiTime.toISOString(); 
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
