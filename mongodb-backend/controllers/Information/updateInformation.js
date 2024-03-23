const router = require('express').Router(); 
const Information = require("../../models/Information");
const asyncHandler = require('express-async-handler');

router.post('/updateInformation', asyncHandler(async (req, res) => {
    
    try {
        const update = req.body;
        const filter = { _id: req.body._id };
        const updatedInformation = await Information.updateOne(filter, update);

        if (updatedInformation.modifiedCount === 1) {
            res.send("success");
        } else {
            res.send("error");
        }
    } catch (error) {
        console.log(error, "updateInformation");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;
