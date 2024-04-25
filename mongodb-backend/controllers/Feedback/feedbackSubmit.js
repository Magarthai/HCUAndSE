const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');

router.post('/createFeedback', asyncHandler(async (req, res) => {
    try {
        if (req.body.date) {
            const bangkokDate = moment.tz(req.body.date, 'Asia/Bangkok'); // Set to Bangkok timezone
            req.body.date = bangkokDate.clone().hour(17).minute(0).second(0).millisecond(0); // Set time in Bangkok
        }
        const newFeedback = await Feedback.create(req.body); // Create new feedback with adjusted date
        res.json("success");
    } catch (error) {
        console.error("Error in createFeedback:", error);
        res.status(500).send("Internal Server Error");
    }
}));

module.exports = router;