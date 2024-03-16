const mongoose = require("mongoose");

// Function to set time to 0:00 (midnight)
function setToMidnight() {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
}

let feedbackSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
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
