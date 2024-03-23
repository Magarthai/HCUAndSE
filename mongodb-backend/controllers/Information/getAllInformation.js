const router = require('express').Router(); 
const Information = require("../../models/Information");
const asyncHandler = require('express-async-handler');

router.get('/getAllInformation', asyncHandler(async (req, res) => {
    try{
    const Informations = await Information.find();
    res.json(Informations);
    } catch (error) {
        console.log(error, "createInformation");
        res.status(500).send("Internal Server Error"); 
    }
}));

module.exports = router;