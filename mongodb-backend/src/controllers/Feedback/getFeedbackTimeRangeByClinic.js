const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');
router.post('/getFeedbackTimeRangeByClinic', asyncHandler(async (req, res) => {
    if (req.body.userData.role != "admin"){
        res.status(500).send("Internal Server Error"); 
    }
    if(req.body.clinic != "คลินิกกายภาพ"){
    try {
        const selectedDate = req.body.selectedDate;
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
        if(selectedDate != undefined && selectedDate){
            startOfMonth=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endOfMonth=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
        };
        console.log(startDate,endDate);
        const feedback = await Feedback.find({ 
            date: {
            $gte: startOfMonth,
            $lt: endOfMonth
        },
            clinic: req.body.clinic
         });
        if (feedback.length > 0){
        let score = 0;
        let feedbackList = []
        for (let i = 0; i < feedback.length; i++) {
            const feedbackScore = feedback[i].score;
            score += feedbackScore
            feedbackList.push(feedback[i])
        }
        const meanScore = score / feedback.length
        const respone = {
            totalSubmit: feedback.length,
            meanScore: meanScore,
            feedbackList: feedbackList
            
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
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
        if(selectedDate != undefined && selectedDate){
            startOfMonth=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endOfMonth=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
        };
        console.log(startDate,endDate);
        const feedbackTalk = await Feedback.find({ 
            date: {
            $gte: startOfMonth,
            $lt: endOfMonth
        },
            clinic: req.body.clinic,
            type: "talk"
         });
        let feedbackListTalk = []
        let score = 0;
        for (let i = 0; i < feedbackTalk.length; i++) {
            const feedbackScore = feedbackTalk[i].score;
            score += feedbackScore
            feedbackListTalk.push(feedbackTalk[i])
        }
        const meanScore = score / feedbackTalk.length

        let feedbackListMain = []
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
             feedbackListMain.push(feedbackMain[i])
         }
         const meanScore2 = score2 / feedbackMain.length
        const respone = {
            totalSubmit: feedbackTalk.length || 0,
            totalSubmit2: feedbackMain.length || 0,
            meanScore: meanScore || 0,
            meanScore2: meanScore2 ||0,
            feedbackListMain: feedbackListMain,
            feedbackListTalk: feedbackListTalk,
        }
        res.json(respone);

    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}
    
}));

module.exports = router;
