const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');

function setToMidnight() {
    const thaiTime = moment().tz('Asia/Bangkok');
    
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });
    return thaiTime.toDate();
}


router.post('/getFeedbackTodayGetByClinicScore2', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    };
    try {
        const selectedDate = req.body.selectedDate;
        const clinic = req.body.clinic;
        let currentDate = await setToMidnight();
        if(selectedDate != undefined && selectedDate){
            const thaiTime = moment(selectedDate).tz('Asia/Bangkok');
            thaiTime.set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            });
            currentDate = thaiTime;
        };

        const feedback = await Feedback.find({ 
            date: currentDate,
            clinic: clinic,
        });

        let allSubmit = 0;
        let totalScore = 0;
        const feedbackList = [
            { name: '5', value: 0 },
            { name: '4', value: 0 },
            { name: '3', value: 0 },
            { name: '2', value: 0 },
            { name: '1', value: 0 },
            { score: 0 , totalSubmit: 0},
        ];
        
        
          feedback.forEach(item => {
            totalScore = totalScore + item.score2;
            allSubmit++;
            if(item.score2 == 5) {
                feedbackList[0].value++;
            } else if(item.score2 == 4) {
                feedbackList[1].value++;
            } else if(item.score2 == 3) {
                feedbackList[2].value++;
            } else if(item.score2 == 2) {
                feedbackList[3].value++;
            } else if(item.score2 == 1) {
                feedbackList[4].value++;
            }
          });

          let meanScore = 0;
          if (allSubmit > 0) {
            meanScore = totalScore / allSubmit
          }
          feedbackList[5].score = feedbackList[5].score + meanScore
          feedbackList[5].totalSubmit = feedbackList[5].totalSubmit + allSubmit;

            res.send(feedbackList);
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;
