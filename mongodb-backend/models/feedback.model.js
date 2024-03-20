const mongoose = require("mongoose");
const moment = require('moment-timezone');
function setToMidnight() {
    const thaiTime = moment().tz('Asia/Bangkok');
    
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });
    
    return thaiTime.format();
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
        default: setToMidnight 
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
