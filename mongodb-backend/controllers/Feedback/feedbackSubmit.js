const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');
router.post('/createFeedback', asyncHandler(async (req, res) => {
    const date = moment(req.body.date).tz('Asia/Bangkok')
    try{
    const data = {
        score: req.body.score,
        detail: req.body.detail,
        clinic: req.body.clinic,
        typeFeedback: req.body.typeFeedback,
        date: date
    }
    const newFeedback = await data.create(req.body);
    res.json("success")
    } catch (error) {
        console.log(error, "createFeedback");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;