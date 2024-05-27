const router = require('express').Router(); 
const Feedback = require("../../models/feedback.model");
const asyncHandler = require('express-async-handler');
router.post('/createFeedback', asyncHandler(async (req, res) => {
    try {
        const newFeedback = await Feedback.create(req.body);
        res.json("success");
    } catch (error) {
        console.error("Error in createFeedback:", error);
        res.status(500).send("Internal Server Error");
    }
}));
module.exports = router;