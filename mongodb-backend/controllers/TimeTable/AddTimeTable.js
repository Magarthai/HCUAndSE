const router = require('express').Router(); 
const TimeTable = require("../../models/timeTable.model");
const asyncHandler = require('express-async-handler');

router.post('/addTimeTable', asyncHandler(async (req, res) => {
    try {
        const newUser = await TimeTable.create(req.body);
        res.json("success");
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;