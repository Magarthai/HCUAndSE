const TimeTable = require("../../models/timeTable.model");
const router = require('express').Router(); 
const asyncHandler = require('express-async-handler');

router.post('/fetchTimeTable', asyncHandler(async (req, res) => {
    const clinic = req.body.clinic
    const findTimeTable = await TimeTable.find({ clinic: clinic });
    if(findTimeTable.length > 0) {
        res.json(findTimeTable);
    } else {
        res.json("not found timetable");
    }
}));

module.exports = router;