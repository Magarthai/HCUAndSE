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

router.post('/getFeedbackTimeRangeTodayRange', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try {
        const currentDate = await setToMidnight();
        const feedback = await Feedback.find({ 
            date: currentDate,
            clinic: "คลินิกทั้งหมด",
        });
        let firstScore = 0;
        let secondScore = 0;
        let thirdScore = 0;
        let fourthScore = 0;
        let fifthScore = 0;
        let sixthScore = 0;
        const feedbackList = [
            {
                name: 'บริการตรวจรักษาโรคโดยแพทย์',
                score: 0,
                lenght: 0,
                
            },
            {
                name: 'บริการจ่ายยาโดยพยาบาล',
                score: 0,
                lenght: 0,
            },
            {
                name: 'บริการทำแผล-ฉีดยา',
                score: 0,
                lenght: 0,
            },
            {
                name: 'บริการกายภาพบำบัด',
                score: 0,
                lenght: 0,
            },
            {
                name: 'บริการฝังเข็ม',
                score: 0,
                lenght: 0,
            },
            {
                name: 'อื่นๆ',
                score: 0,
                lenght: 0,
            },
        ];
        
          feedback.forEach(item => {
            if(item.typeFeedback == "บริการตรวจรักษาโรคโดยแพทย์"){
                feedbackList[0].score += item.score;
                firstScore++;
            } else if (item.typeFeedback == "บริการจ่ายยาโดยพยาบาล"){
                feedbackList[1].score += item.score;
                secondScore++;
            } else if (item.typeFeedback == "บริการทำแผล-ฉีดยา"){
                feedbackList[2].score += item.score;
                thirdScore++;
            } else if (item.typeFeedback == "บริการกายภาพบำบัด"){
                feedbackList[3].score += item.score;
                fourthScore++;
            }  else if (item.typeFeedback == "บริการฝังเข็ม"){
                feedbackList[4].score += item.score;
                fifthScore++;
            } else if (item.typeFeedback == "อื่นๆ"){
                feedbackList[5].score += item.score;
                sixthScore++;
            } else {
                console.error("Unknown feedback type:", item.typeFeedback);
            }
          });

          if(feedbackList[0].score != 0){
          feedbackList[0].score = feedbackList[0].score / firstScore;
          }
          if(feedbackList[1].score != 0){
          feedbackList[1].score = feedbackList[1].score / secondScore;
          } 
          if(feedbackList[2].score != 0){
          feedbackList[2].score = feedbackList[2].score / thirdScore;
          }
          if(feedbackList[3].score != 0){
          feedbackList[3].score = feedbackList[3].score / fourthScore;
          }
          if (feedbackList[3].score != 0){
          feedbackList[4].score = feedbackList[4].score / fifthScore;
          }
          if (feedbackList[5].score != 0){
          feedbackList[5].score = feedbackList[5].score / sixthScore;
          }


          feedbackList[0].lenght = firstScore;
          feedbackList[1].lenght = secondScore;
          feedbackList[2].lenght = thirdScore;
          feedbackList[3].lenght = fourthScore;
          feedbackList[4].lenght = fifthScore;
          feedbackList[5].lenght = sixthScore;
        res.json(feedbackList);
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;