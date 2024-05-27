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
    
    return thaiTime;
}


let dashboardSchema = new mongoose.Schema({
    status: {
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
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
