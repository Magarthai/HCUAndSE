const Holiday = require("../../models/holiday.model");
const router = require('express').Router(); 
const asyncHandler = require('express-async-handler');

router.post('/checkDateHoliday', asyncHandler(async (req, res) => {
    const selectedDate = req.body.date
    console.log(selectedDate)
    const findSameStudentId = await Holiday.findOne({ date: selectedDate });
    if(findSameStudentId) {
        console.log(findSameStudentId,"findSameStudentId")
        res.json("Date exits!");
    } else {
        res.json("success");
    }
}));

module.exports = router;