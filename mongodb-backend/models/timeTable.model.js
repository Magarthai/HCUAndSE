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
    },
    numberMainAppointmentCheck:{
        type: Number,
    },
    timeAppointmentMainEnd:{
        type: String,
    },
    timeAppointmentMainStart:{
        type: String,
    },
    numberAppointment:{
        type: Number,
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