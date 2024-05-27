const mongoose = require("mongoose");

let holidaySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    note: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model('Holiday', holidaySchema);
