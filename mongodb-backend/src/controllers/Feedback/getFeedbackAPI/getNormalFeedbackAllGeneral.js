const Feedback = require('../../../models/feedback.model');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');
router.post('/getNormalFeedbackAllGeneral', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try{
    const clinic = "คลินิกทั้งหมด";
    let selectedDate = "";
    console.log(req.body.selectedDate)
    if (req.body.selectedDate !== undefined) {
        const date = new Date(req.body.selectedDate);
        const bangkokDate = moment(date).tz("Asia/Bangkok"); 
        
        bangkokDate.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        });
    
        console.log(bangkokDate.toISOString(), " - Start of the day in Bangkok timezone");

        selectedDate = bangkokDate.toDate(); 
    }
    let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
    let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

    let feedback = await Feedback.find({
        createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
        },
        clinic: clinic,
    }).sort({ date: -1 });
    if(selectedDate != undefined && selectedDate){
        feedback = await Feedback.find({
            date: selectedDate,
            clinic: clinic,
        }).sort({ date: -1 });
        console.log(feedback,selectedDate)
    };
    const formattedFeedback = feedback.map(item => {
        const parsedDate = moment(item.createdAt).format('DD/MM/YYYY');
        
        return {
            ...item.toObject(), 
            date: parsedDate
        };
    });
    console.log(formattedFeedback,selectedDate)
    if (formattedFeedback.length > 0) {
        res.send(formattedFeedback);

    } else {
        res.send('not found')
    }
} catch (error){
    console.log(error, "getNormalFeedbackAllGeneral");
    res.status(500).send("Internal Server Error"); 
}

}));
module.exports = router;