const router = require('express').Router(); 
const User = require("../../models/users.model");
const asyncHandler = require('express-async-handler');

router.post('/getUserData', asyncHandler(async (req, res) => {
    try {
        const id = req.body.uid
        const userData = await User.findOne({ uid: id });
        res.json(userData);
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;

