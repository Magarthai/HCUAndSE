const router = require('express').Router(); 
const User = require("../../models/users.model");
const asyncHandler = require('express-async-handler');

router.post('/createUsers', asyncHandler(async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json("success");
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;

