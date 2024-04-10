const Feedback = require('../../../models/feedback.model');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');

router.post('/getGeneralSpecialFeedback', asyncHandler(async(req,res) => {
    try{
        const clinic = req.body.clinic;
        const type = req.body.type;
        let selectedDate = "";

        if( req.body.selectedDate != undefined &&  req.body.selectedDate) {
            selectedDate = moment(req.body.selectedDate).tz('Asia/Bangkok');
        }
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

        let feedback = [];

        if( selectedDate =="") {
            feedback = await Feedback.find({
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                },
                clinic: clinic,
                type: type
            }).sort({date: -1})
        } else {
            feedback = await Feedback.find({
                date: selectedDate,
                clinic: clinic,
                type: type
            });
        }
        const formattedFeedback = feedback.map(item => {
            const parsedDate = moment(item.createdAt).format('DD/MM/YYYY');
            
            return {
                ...item.toObject(), 
                date: parsedDate
            };
        });
        
        if (formattedFeedback.length > 0){
            res.send(formattedFeedback);
        } else {
            res.send('not found');
            res.status(500).send("Internal Server Error"); 
        }

    } catch(error) {
        console.log(error);
    }
}))

module.exports = router;