const router = require('express').Router(); 
const User = require("../../models/users.model");
const asyncHandler = require('express-async-handler');

router.post('/checkStudentID', asyncHandler(async (req, res) => {
    const studentId = req.body.id
    const findSameStudentId = await User.findOne({ id: studentId });
    if(findSameStudentId) {
        console.log(findSameStudentId,"findSameStudentId")
        res.json("Student id already exits!");
    } else {
        res.json("success");
    }
}));

module.exports = router;