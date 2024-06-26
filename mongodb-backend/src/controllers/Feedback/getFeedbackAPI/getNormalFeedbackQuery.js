const Feedback = require('../../../models/feedback.model');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');
router.post('/getNormalFeedbackQuery', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try{
    const typeFeedback = req.body.typeFeedback;
    const clinic = "คลินิกทั้งหมด";
    let selectedDate = "";

    if(req.body.selectedDate != undefined) {
        const date = new Date(req.body.selectedDate);
        const bangkokDate = moment(date).tz("Asia/Bangkok"); 
        bangkokDate.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        });
        bangkokDate.toISOString(); 
        console.log(bangkokDate.format(),"XDDDDDDDDDDDDDDDDD");
        selectedDate = bangkokDate;
    }
    let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
    let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
    if(selectedDate != undefined && selectedDate){
        startOfMonth=moment(selectedDate).tz('Asia/Bangkok');
        endOfMonth=moment(selectedDate).tz('Asia/Bangkok');
    };

    let feedback = await Feedback.find({
        createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
        },
        clinic: clinic,
        typeFeedback: typeFeedback,
    }).sort({ date: -1 });
    if(selectedDate != undefined && selectedDate){
        feedback = await Feedback.find({
            date: selectedDate.format(),
            clinic: clinic,
            typeFeedback: typeFeedback,
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
    console.log(formattedFeedback,typeFeedback)
    if (formattedFeedback.length > 0) {
        res.send(formattedFeedback);
    } else {
        res.send('not found')
    }
} catch (error){
    console.log(error, "getNormalFeedbackQuery");
    res.status(500).send("Internal Server Error"); 
}

}));
module.exports = router;