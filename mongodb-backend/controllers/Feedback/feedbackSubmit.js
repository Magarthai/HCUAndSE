const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');
router.post('/createFeedback', asyncHandler(async (req, res) => {
    try {

        
        let bangkokDate = moment.tz(req.body.date, 'Asia/Bangkok'); // Set timezone
        bangkokDate = bangkokDate.clone().hour(17).minute(0).second(0).millisecond(0); // Set time
        
        req.body.date = bangkokDate.toISOString(); // Convert to ISO string to maintain format
        console.log(req.body.date);
        
        // Create new feedback with corrected date
        const newFeedback = await Feedback.create(req.body);
        res.json("success");
    } catch (error) {
        console.error("Error in createFeedback:", error);
        res.status(500).send("Internal Server Error");
    }
}));
module.exports = router;