const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');

router.post('/createFeedback', asyncHandler(async (req, res) => {
    try{
        if (req.body.date) {
        const bangkokDate = moment.tz(req.body.date, 'Asia/Bangkok'); 
        req.body.date = bangkokDate.toISOString(); 
        }
    const newFeedback = await Feedback.create(req.body);
    res.json("success")
    } catch (error) {
        console.log(error, "createFeedback");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;