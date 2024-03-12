const Holiday = require("../../models/holiday.model");
const router = require('express').Router(); 
const asyncHandler = require('express-async-handler');

router.post('/deleteHoliday', asyncHandler(async (req, res) => {
    const deletedHoliday  = await Holiday.findByIdAndDelete(req.body._id);
    res.json("success");
}));

module.exports = router;