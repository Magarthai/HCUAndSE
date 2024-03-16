const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");

router.post('/getFeedbackByRange', asyncHandler(async (req, res) => {
    try {
        console.log(req.body)
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        console.log(startDate,endDate);
        const feedback = await Feedback.find({ date: {
            $gte: startDate,
            $lt: endDate
        } });
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
    } catch (error) {
        console.log(error, "getFeedbackByRange");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;
