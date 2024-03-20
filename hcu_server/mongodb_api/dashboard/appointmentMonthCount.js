const Dashboard = require("../../model/appointmentDashboard.model");
const router = require('express').Router(); 
const mongoose = require("mongoose");
const moment = require('moment-timezone');
const asyncHandler = require('express-async-handler');

function setToMidnight() {
    const thaiTime = moment().tz('Asia/Bangkok');
    
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });
    return thaiTime.toDate();
}


  router.post('/getCountAppointment', asyncHandler(async (req, res) => {

    if (req.body.userData.role != "admin"){
        res.status(500).send("Internal Server Error"); 
    }
    try {
        let currentDate = await setToMidnight();
        const selectedDate = req.body.selectedDate
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
        if(selectedDate != undefined && selectedDate){
            startOfMonth=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endOfMonth=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
            const thaiTime = moment(selectedDate).tz('Asia/Bangkok');
    
            thaiTime.set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            });

            currentDate = thaiTime;
        };
        const Dashboards = await Dashboard.find({ 
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
        });
        const DashboardToday = await Dashboard.find({ 
            date: currentDate
        });
        console.log(DashboardToday,"DashboardToday")
        const info = {
            all: Dashboards.length,
            today: DashboardToday.length
        };
        res.json(info)
    } catch (error) {
        console.log(error, "getDashboardMonthRange");
        res.status(500).send("Internal Server Error"); 
    }
}));


module.exports = router;
