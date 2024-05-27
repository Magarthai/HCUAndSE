const DeleteAppointment = require('../../model/deletedAppointment.model');
const express = require('express');
const router = express.Router();


router.post('/getCanceledData', async (req, res) => {
    console.log(req.body.role)
    if(req.body.role != "admin"){
        return res.status(500).json({ error: 'Internal server error' }); 
    }
    try {
        const data = await DeleteAppointment.find();
        res.send(data);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});


module.exports = router;