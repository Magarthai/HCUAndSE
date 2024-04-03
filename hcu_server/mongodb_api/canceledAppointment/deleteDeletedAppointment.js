const DeleteAppointment = require('../../model/deletedAppointment.model');
const express = require('express');
const router = express.Router();


router.post('/deleteDeletedAppointment', async (req, res) => {
    console.log(req.body.role)
    if(req.body.role != "admin"){
        return res.status(500).json({ error: 'Internal server error' }); 
    }
    try {

        const _id = req.body._id;
        const data = await DeleteAppointment.deleteOne({_id:_id});
        res.send(data);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});


module.exports = router;