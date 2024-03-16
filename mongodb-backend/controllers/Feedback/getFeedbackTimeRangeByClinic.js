const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");

router.post('/getFeedbackTimeRangeByClinic', asyncHandler(async (req, res) => {
    if(req.body.clinic != "คลินิกกายภาพ"){
    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        console.log(startDate,endDate);
        const feedback = await Feedback.find({ 
            date: {
            $gte: startDate,
            $lt: endDate},
            clinic: req.body.clinic
         });
        if (feedback.length > 0){
        let score = 0;
        for (let i = 0; i < feedback.length; i++) {
            const feedbackScore = feedback[i].score;
            score += feedbackScore
        }
        const meanScore = score / feedback.length
        const respone = {
            totalSubmit: feedback.length,
            meanScore: meanScore
        }
        res.json(respone);
    } else {
        const respone = {
            totalSubmit: 0,
            meanScore: 0
        }
        res.json(respone);
    }
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
} else {
    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        console.log(startDate,endDate);
        const feedbackTalk = await Feedback.find({ 
            date: {
            $gte: startDate,
            $lt: endDate},
            clinic: req.body.clinic,
            type: "talk"
         });

        let score = 0;
        for (let i = 0; i < feedbackTalk.length; i++) {
            const feedbackScore = feedbackTalk[i].score;
            score += feedbackScore
        }
        const meanScore = score / feedbackTalk.length
        const feedbackMain = await Feedback.find({ 
            date: {
            $gte: startDate,
            $lt: endDate},
            clinic: req.body.clinic,
            type: "main"
         });
         let score2 = 0;
         for (let i = 0; i < feedbackMain.length; i++) {
             const feedbackScore = feedbackMain[i].score;
             score2 += feedbackScore
         }
         const meanScore2 = score2 / feedbackMain.length
        const respone = {
            totalSubmit: feedbackTalk.length || 0,
            totalSubmit2: feedbackMain.length || 0,
            meanScore: meanScore || 0,
            meanScore2: meanScore2 ||0,
        }
        res.json(respone);

    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}
    
}));

module.exports = router;
