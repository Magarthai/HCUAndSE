const router = require('express').Router(); 
const Holiday = require("../../models/holiday.model");
const asyncHandler = require('express-async-handler');

router.post('/createHoliday', asyncHandler(async (req, res) => {
    try {
        const newUser = await Holiday.create(req.body);
        res.json("success");
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;

