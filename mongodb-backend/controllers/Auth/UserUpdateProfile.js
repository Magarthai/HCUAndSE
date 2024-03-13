const router = require('express').Router(); 
const User = require("../../models/users.model");
const asyncHandler = require('express-async-handler');

router.post('/UpdateUserData', asyncHandler(async (req, res) => {
    try {
        const userId = req.body._id;
        console.log(userId,"userId")
        const updatedData = req.body.updatedData; 
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        res.json("success");
    } catch (error) {
        console.log(error, "update user");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;

