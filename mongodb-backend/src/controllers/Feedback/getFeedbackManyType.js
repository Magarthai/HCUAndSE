const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");

router.post('/getFeedbackManyType', asyncHandler(async (req, res) => {

    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        console.log(startDate,endDate);
        const feedback = await Feedback.find({ 
            date: {
            $gte: startDate,
            $lt: endDate},
            clinic: "คลินิกทั้งหมด"
         });
        let score1 = 0;
        let score2 = 0;
        let score3 = 0;
        let score4 = 0;
        let score5 = 0;

        let totalSubmit1 = 0;
        let totalSubmit2 = 0;
        let totalSubmit3 = 0;
        let totalSubmit4 = 0;
        let totalSubmit5 = 0;

        let feedbackList1 = [];
        let feedbackList2 = [];
        let feedbackList3 = [];
        let feedbackList4 = [];
        let feedbackList5 = [];

        if (feedback.length > 0){
        for (let i = 0; i < feedback.length; i++) {
            const typeFeedback = feedback[i].typeFeedback;
            const feedbackScore = feedback[i].score;
            if(typeFeedback == "บริการตรวจรักษาโรคโดยแพทย์"){
                score1 += feedbackScore;
                totalSubmit1 += 1
                feedbackList1.push(feedback[i]);
            } else if (typeFeedback == "บริการจ่ายยาโดยพยาบาล"){
                score2 += feedbackScore;
                totalSubmit2 += 1
                feedbackList2.push(feedback[i]);
            } else if (typeFeedback == "บริการทำแผล-ฉีดยา"){
                score3 += feedbackScore;
                totalSubmit3 += 1
                feedbackList3.push(feedback[i]);
            } else if (typeFeedback == "บริการกายภาพบำบัด"){
                score4 += feedbackScore;
                totalSubmit4 += 1
                feedbackList4.push(feedback[i]);
            } else {
                score5 += feedbackScore;
                totalSubmit5 += 1
                feedbackList5.push(feedback[i]);
            }
            
        }

        score1 = score1 / totalSubmit1;
        score2 = score2 / totalSubmit2;
        score3 = score3 / totalSubmit3;
        score4 = score4 / totalSubmit4;
        score5 = score5 / totalSubmit5;

        const respone = {
            1:{
                meanScore: score1 || 0,
                totalSubmit: totalSubmit1 || 0,
                feedbackList: feedbackList1 || []
            },
            2:{
                meanScore: score2 || 0,
                totalSubmit: totalSubmit2 || 0,
                feedbackList: feedbackList2 || []
            },
            3:{
                meanScore: score3 || 0,
                totalSubmit: totalSubmit3 || 0,
                feedbackList: feedbackList3 || []
            },
            4:{
                meanScore: score4 || 0,
                totalSubmit: totalSubmit4 || 0,
                feedbackList: feedbackList4 || []
            },
            5:{
                meanScore: score5 || 0,
                totalSubmit: totalSubmit5 || 0,
                feedbackList: feedbackList5 || []
            },

        }

        res.json(respone);
    } else {
        const respone = {
            1:{
                meanScore: 0,
                totalSubmit: 0,
                feedbackList: []
            },
            2:{
                meanScore: 0,
                totalSubmit: 0,
                feedbackList: []
            },
            3:{
                meanScore: 0,
                totalSubmit: 0,
                feedbackList: []
            },
            4:{
                meanScore: 0,
                totalSubmit: 0,
                feedbackList: []
            },
            5:{
                meanScore: 0,
                totalSubmit: 0,
                feedbackList: []
            },
        }
        res.json(respone);
    }
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;
