const Holiday = require("../../models/holiday.model");
const router = require('express').Router(); 
const asyncHandler = require('express-async-handler');

router.get('/getHoliday', asyncHandler(async (req, res) => {
    const findSameStudentId = await Holiday.find({});
    res.json(findSameStudentId);
}));

module.exports = router;