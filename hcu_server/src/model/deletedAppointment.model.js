const mongoose = require("mongoose");

let DeleteAppointmentSchema = new mongoose.Schema({
    appointmentCasue: {
        type: String,
    },
    appointmentId: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true,
    },
    appointmentDate2: {
        type: String,
    },
    appointmentNotation: {
        type: String,
    },
    appointmentSymptom: {
        type: String,
    },
    appointmentSymptom2: {
        type: String,
    },
    appointmentTime: {
        type: [{
            timeSlotIndex: { type: String },
            timetableId: { type: String } 
        }],
    },
    appointmentTime2: {
        type: [{
            timeSlotIndex: { type: String },
            timetableId: { type: String } 
        }],
    },
    appove: {
        type: String,
    },
    appove: {
        type: String,
    },
    clinic: {
        type: String,
        required: true,
    },
    postPone: {
        type: String,
    },
    status: {
        type: String,
    },
    status: {
        type: String,
    },
    subject: {
        type: String,
    },
    name: {
        type: String,
    },
    tel: {
        type: String,
    },
    time: {
        start: { type: String }, 
        end: { type: String } 
    }
}, { timestamps: true });

module.exports = mongoose.model('DeleteAppointment', DeleteAppointmentSchema);
