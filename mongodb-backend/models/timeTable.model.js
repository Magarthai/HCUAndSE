const mongoose = require('mongoose');
let timeTable = new mongoose.Schema({
    addDay:{
        type: String,
        required: true
    },
    appointmentList:{
        type: [{
            appointmentDate: { type: String },
            appointmentId: { type: String } 
        }],
    },
    clinic:{
        type: String,
        required: true
    },
    isDelete:{
        type: String,
        required: true,
        default: 'No'
    },
    numberMainAppointment:{
        type: Number,
        required: true,
    },
    numberMainAppointmentCheck:{
        type: Number,
        required: true,
    },
    timeAppointmentMainEnd:{
        type: String,
        required: true,
    },
    timeAppointmentMainStart:{
        type: String,
        required: true,
    },
    numberAppointment:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: 'Enabled'
    },
    timeAppointmentEnd: {
        type: String,
    },
    timeAppointmentStart: {
        type: String,
    },
    timeStart: {
        type: String,
        required: true,
    },
    timeEnd: {
        type: String,
        required: true,
    },
    timeablelist: {
        type: [{
            start: { type: String },
            end: { type: String } 
        }]
        
    }, 
});

module.exports = mongoose.model('timeTable', timeTable);