const router = require('express').Router();
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const moment = require('moment-timezone');

router.post('/getFeedbackTimeRangeGetByClinicPhysicNeedle', asyncHandler(async (req, res) => {
    const role = req.body.role;
    if (role != 'admin') {
        res.status(500).send("Internal Server Error");
    };
    try {
        const clinic = req.body.clinic;
        const selectedDate = req.body.selectedDate;
        let startDate = moment().startOf('month').tz('Asia/Bangkok');
        let endDate = moment().endOf('month').tz('Asia/Bangkok');
        if(selectedDate != undefined && selectedDate){
            startDate=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endDate=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
        };
        const feedback = await Feedback.find({
            date: {
                $gte: startDate,
                $lt: endDate
            },
            clinic: clinic,
        });

        let allSubmitTalk = 0;
        let totalScoreTalk = 0;

        let allSubmitMain = 0;
        let totalScoreMain = 0;

        const feedbackList = [
            [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0, totalSubmit: 0 },
            ], [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
                { score: 0, totalSubmit: 0 },
            ]
        ];


        feedback.forEach(item => {
            
            if(item.type=="talk"){
                totalScoreTalk = totalScoreTalk + item.score;
                allSubmitTalk++;
                if (item.score == 5) {
                    feedbackList[0][0].value++;
                } else if (item.score == 4) {
                    feedbackList[0][1].value++;
                } else if (item.score == 3) {
                    feedbackList[0][2].value++;
                } else if (item.score == 2) {
                    feedbackList[0][3].value++;
                } else if (item.score == 1) {
                    feedbackList[0][4].value++;
                } 
            } else if (item.type=="main"){
                totalScoreMain = totalScoreMain + item.score;
                allSubmitMain++;
                if (item.score == 5) {
                    feedbackList[1][0].value++;
                } else if (item.score == 4) {
                    feedbackList[1][1].value++;
                } else if (item.score == 3) {
                    feedbackList[1][2].value++;
                } else if (item.score == 2) {
                    feedbackList[1][3].value++;
                } else if (item.score == 1) {
                    feedbackList[1][4].value++;
                } 
            }
        });
        
        if(allSubmitTalk > 0 ){
        const meanScore = totalScoreTalk / allSubmitTalk
        feedbackList[0][5].score = feedbackList[0][5].score + meanScore
        }
        feedbackList[0][5].totalSubmit = feedbackList[0][5].totalSubmit + allSubmitTalk;
        
        if(allSubmitMain > 0 ){
        const meanScoreMain = totalScoreMain / allSubmitMain
        feedbackList[1][5].score = feedbackList[1][5].score + meanScoreMain
        }
        feedbackList[1][5].totalSubmit = feedbackList[1][5].totalSubmit + allSubmitMain;

        res.json(feedbackList);
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error");
    }
}));

module.exports = router;
