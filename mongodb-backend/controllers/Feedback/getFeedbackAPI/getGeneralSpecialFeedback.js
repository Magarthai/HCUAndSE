const Feedback = require('../../../models/feedback.model');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');

router.post('/getGeneralSpecialFeedback', asyncHandler(async(req,res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try{
        const clinic = req.body.clinic;
        let selectedDate = "";

        if( req.body.selectedDate != undefined &&  req.body.selectedDate) {
            selectedDate = moment(req.body.selectedDate).tz('Asia/Bangkok');
        }
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

        let feedback = [];
        console.log(selectedDate)
        if( selectedDate == "") {
            console.log("XD")
            feedback = await Feedback.find({
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                },
                clinic: clinic,
            }).sort({date: -1})
        } else {
            console.log(selectedDate)
            console.log("XD2")
            feedback = await Feedback.find({
                date: selectedDate,
                clinic: clinic,
            });
        }
        console.log(feedback);
        const formattedFeedback = feedback.map(item => {
            const parsedDate = moment(item.date).format('DD/MM/YYYY');
            
            return {
                ...item.toObject(), 
                date: parsedDate,
                serviceType1: "บริการตรวจรักษาโรคโดยแพทย์",
                serviceType2: "บริการจ่ายยาโดยพยาบาล"
            };
        });
        
        if (formattedFeedback.length > 0){
            res.send(formattedFeedback);
        } else {
            res.send('not found'); // Sending a 404 status for resource not found
        }
        
        

    } catch(error) {
        console.log(error);
    }
}))

module.exports = router;