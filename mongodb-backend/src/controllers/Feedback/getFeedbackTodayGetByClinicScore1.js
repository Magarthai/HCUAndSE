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


router.post('/getFeedbackTodayGetByClinicScore1', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    };
    try {
        const clinic = req.body.clinic;
        const selectedDate = req.body.selectedDate;
        let startDate = moment().startOf('month').tz('Asia/Bangkok');
        let endDate = moment().endOf('month').tz('Asia/Bangkok');
        

        let currentDate = await setToMidnight();

        if(selectedDate != undefined && selectedDate){
            startDate=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endDate=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
            const date = new Date(req.body.selectedDate);
            const bangkokDate = moment(date).tz("Asia/Bangkok"); 
            
            bangkokDate.set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            });
        
            console.log(bangkokDate.toISOString(), " - Start of the day in Bangkok timezone");

            currentDate = bangkokDate.toDate(); 
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
            totalScore = totalScore + item.score;
            allSubmit++;
            if(item.score == 5) {
                feedbackList[0].value++;
            } else if(item.score == 4) {
                feedbackList[1].value++;
            } else if(item.score == 3) {
                feedbackList[2].value++;
            } else if(item.score == 2) {
                feedbackList[3].value++;
            } else if(item.score == 1) {
                feedbackList[4].value++;
            }
          });

          let meanScore = 0;
          if (allSubmit > 0) {
            meanScore = totalScore / allSubmit
          }
          feedbackList[5].score = feedbackList[5].score + meanScore
          feedbackList[5].totalSubmit = feedbackList[5].totalSubmit + allSubmit;

            res.json(feedbackList);
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;
