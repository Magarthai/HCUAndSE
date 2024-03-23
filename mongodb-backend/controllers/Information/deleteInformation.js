const router = require('express').Router(); 
const Information = require("../../models/Information");
const asyncHandler = require('express-async-handler');

router.post('/deleteInformation', asyncHandler(async (req, res) => {
    try{
    const deletedInformation = await Information.deleteOne({ _id: req.body._id });

    if (deletedInformation.deletedCount === 1) {
        res.send("success");
    } else {
        res.send('error');
    }
    
    res.json("success")
    } catch (error) {
        console.log(error, "createInformation");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;