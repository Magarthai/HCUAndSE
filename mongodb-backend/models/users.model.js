const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const RedeemcCode = require('./timeTable.model');
let userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    id:{
        type: Number,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    uid: {
        type: String,
        default: 'user'
    },
    userLineID: {
        type: String,
        default: 'user'
    },
    appointments: {
        type: [String],
    },
    userActivity: {
        type: [{
            activityId: { type: String },
            index: { type: Number } 
        }]
    }    

});

module.exports = mongoose.model('User', userSchema);