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
    console.log(req.body.selectedDate);
    const startDate = moment(req.body.selectedDate).startOf('day').tz('Asia/Bangkok')
    const endDate = moment(req.body.selectedDate).endOf('day').tz('Asia/Bangkok')
    let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
    let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

    let feedback = await Feedback.find({
        date: {
            $gte: startOfMonth,
            $lt: endOfMonth
        },
        clinic: clinic,
    }).sort({ date: -1 });
    if(selectedDate != undefined && selectedDate){
        feedback = await Feedback.find({
            date: {
                $gte: startDate,
                $lte: endDate,   
              },
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