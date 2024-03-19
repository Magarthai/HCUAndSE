const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');
router.post('/getFeedbackTimeRangeData2', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error"); 
    }
    try {
        const startDate = moment().startOf('month').tz('Asia/Bangkok');
        const endDate = moment().endOf('month').tz('Asia/Bangkok');
        console.log(startDate,endDate);
        const feedback = await Feedback.find({ 
            date: {
                $gte: startDate,
                $lt: endDate
            },
            clinic: "คลินิกทั้งหมด",
        });
        let firstScore = 0;
        let secondScore = 0;
        let thirdScore = 0;
        let fourthScore = 0;
        let fifthScore = 0;
        let sixthScore = 0;
        
        const feedbackList = [
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ],
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ],
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ],
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ],
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ],
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0},
            ]
        ];
        
        
          feedback.forEach(item => {
            if(item.typeFeedback == "บริการตรวจรักษาโรคโดยแพทย์"){
                feedbackList[0][5].score += item.score;
                firstScore++;
                if(item.score == 5){
                    feedbackList[0][0].value ++;
                } else if(item.score == 4){
                    feedbackList[0][1].value++;
                } else if(item.score == 3){
                    feedbackList[0][2].value++;
                } else if(item.score == 2){
                    feedbackList[0][3].value++;
                } else if(item.score == 1){
                    feedbackList[0][4].value++;
                } 
            } else if (item.typeFeedback == "บริการจ่ายโดยพยาบาล"){
                feedbackList[1][5].score += item.score;
                secondScore++;
                if(item.score == 5){
                    feedbackList[1][0].value ++;
                } else if(item.score == 4){
                    feedbackList[1][1].value++;
                } else if(item.score == 3){
                    feedbackList[1][2].value++;
                } else if(item.score == 2){
                    feedbackList[1][3].value++;
                } else if(item.score == 1){
                    feedbackList[1][4].value++;
                } 
            } else if (item.typeFeedback == "บริการทำแผล-ฉีดยา"){
                feedbackList[2][5].score += item.score;
                thirdScore++;
                if(item.score == 5){
                    feedbackList[2][0].value ++;
                } else if(item.score == 4){
                    feedbackList[2][1].value++;
                } else if(item.score == 3){
                    feedbackList[2][2].value++;
                } else if(item.score == 2){
                    feedbackList[2][3].value++;
                } else if(item.score == 1){
                    feedbackList[2][4].value++;
                } 
            } else if (item.typeFeedback == "บริการกายภาพบำบัด"){
                feedbackList[3][5].score += item.score;
                fourthScore++;
                if(item.score == 5){
                    feedbackList[3][0].value ++;
                } else if(item.score == 4){
                    feedbackList[3][1].value++;
                } else if(item.score == 3){
                    feedbackList[3][2].value++;
                } else if(item.score == 2){
                    feedbackList[3][3].value++;
                } else if(item.score == 1){
                    feedbackList[3][4].value++;
                } 
            }  else if (item.typeFeedback == "บริการฝังเข็ม"){
                feedbackList[4][5].score += item.score;
                fifthScore++;
                if(item.score == 5){
                    feedbackList[4][0].value ++;
                } else if(item.score == 4){
                    feedbackList[4][1].value++;
                } else if(item.score == 3){
                    feedbackList[4][2].value++;
                } else if(item.score == 2){
                    feedbackList[4][3].value++;
                } else if(item.score == 1){
                    feedbackList[4][4].value++;
                } 
            } else if (item.typeFeedback == "อื่นๆ"){
                feedbackList[5][5].score += item.score;
                sixthScore++;
                if(item.score == 5){
                    feedbackList[5][0].value ++;
                } else if(item.score == 4){
                    feedbackList[5][1].value++;
                } else if(item.score == 3){
                    feedbackList[5][2].value++;
                } else if(item.score == 2){
                    feedbackList[5][3].value++;
                } else if(item.score == 1){
                    feedbackList[5][4].value++;
                } 
            } else {
                console.error("Unknown feedback type:", item.typeFeedback);
            }
          });

            if(feedbackList[0][5].score != 0){
            feedbackList[0][5].score = feedbackList[0][5].score / firstScore;
            }
            if(feedbackList[1][5].score  != 0){
            feedbackList[1][5].score = feedbackList[1][5].score / secondScore;
            } 
            if(feedbackList[2][5].score != 0){
            feedbackList[2][5].score = feedbackList[2][5].score / thirdScore;
            }
            if(feedbackList[3][5].score != 0){
            feedbackList[3][5].score = feedbackList[3][5].score / fourthScore;
            }
            if (feedbackList[4][5].score != 0){
            feedbackList[4][5].score = feedbackList[4][5].score / fifthScore;
            }
            if (feedbackList[5][5].score != 0){
            feedbackList[5][5].score = feedbackList[5][5].score / sixthScore;
            }

            res.json(feedbackList);
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;