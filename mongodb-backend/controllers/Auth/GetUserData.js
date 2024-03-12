const router = require('express').Router(); 
const User = require("../../models/users.model");
const asyncHandler = require('express-async-handler');

router.get('/getUserData', asyncHandler(async (req, res) => {
    try {
        const userData = await User.findOne({ id: studentId });
        res.json("success");
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;

