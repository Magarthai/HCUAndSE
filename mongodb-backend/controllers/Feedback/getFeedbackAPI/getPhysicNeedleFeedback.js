const Feedback = require('../../../models/feedback.model');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');

router.post('/getPhysicNeedleFeedback', asyncHandler(async(req,res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try{
        const clinic = req.body.clinic;
        let selectedDate = "";

        if( req.body.selectedDate != undefined &&  req.body.selectedDate) {
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

        let feedback = [];

        if( req.body.selectedDate != undefined) {
            feedback = await Feedback.find({
                date: selectedDate,
                clinic: clinic,
            }).sort({date: -1})
        } else {
            feedback = await Feedback.find({
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                },
                clinic: clinic,
            });
        }
        console.log(feedback);
        const formattedFeedback = feedback.map(item => {
            const parsedDate = moment(item.createdAt).format('DD/MM/YYYY');
            let type = "";
            let serviceType = "";
            if(item.type == "talk") {
                type = "ปรึกษาแพทย์"
                serviceType = "บริการตรวจรักษาโรคโดยแพทย์"
            } else if (item.type == "main") {
                if(item.clinic == "คลินิกกายภาพ"){
                    type = "ทำกายภาพบำบัด"
                    serviceType = "บริการกายภาพบำบัด"
                } else {
                    type = "ทำฝังเข็ม"
                    serviceType = "บริการฝังเข็ม"
                }
            }
            return {
                ...item.toObject(), 
                type: type,
                date: parsedDate,
                serviceType:serviceType
                
            };
        });
        
        if (formattedFeedback.length > 0){
            res.send(formattedFeedback);
        } else {
            res.send('not found');
        }

    } catch(error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); 
    }
}))

module.exports = router;