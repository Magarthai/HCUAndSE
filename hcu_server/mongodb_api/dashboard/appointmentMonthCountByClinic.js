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


  router.post('/getCountAppointmentByClinic', asyncHandler(async (req, res) => {

    if (req.body.userData.role != "admin"){
        res.status(500).send("Internal Server Error"); 
    }
    try {
        let currentDate = await setToMidnight();
        console.log(currentDate,"currentDate")
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
            currentDate = thaiTime
        };
        const clinic = req.body.clinic
        const Dashboards = await Dashboard.find({ 
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
            clinic: clinic,
        });
        console.log(Dashboards,"Dashboard")
        const DashboardToday = await Dashboard.find({ 
            date: currentDate,
            clinic: clinic,
        });
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
