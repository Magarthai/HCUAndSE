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
    console.log(thaiTime.format('DD/MM/YYYY'))
    return thaiTime.format('DD/MM/YYYY');
}

function formatDate (date) {
    const thaiTime = moment(date).tz('Asia/Bangkok');
    console.log(thaiTime.format('DD/MM/YYYY'))
    return thaiTime.format('DD/MM/YYYY');
}
function groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
      const group = obj[key];
      
      acc[group] = acc[group] || [];
      acc[group].push(obj);
      return acc;
    }, {});
  }



  router.post('/getDashboardMonthRangeCount', asyncHandler(async (req, res) => {
    if (req.body.userData.role != "admin"){
        res.status(500).send("Internal Server Error"); 
    }
    try {
        const selectedDate = req.body.selectedDate;
        let startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        let endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
        if(selectedDate != undefined && selectedDate){
            startOfMonth=moment(selectedDate).startOf('month').tz('Asia/Bangkok');
            endOfMonth=moment(selectedDate).endOf('month').tz('Asia/Bangkok');
        };
        const Dashboards = await Dashboard.find({ 
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
        });

        const groupedData = groupBy(Dashboards, 'clinic');
        console.log(groupedData);
        const data = [];

        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const listData = groupedData[key];
                const info = {
                    name: key,
                    value: listData.length
                };

                data.push(info);
            }
        }
        res.json(data);
    } catch (error) {
        console.log(error, "getDashboardMonthRange");
        res.status(500).send("Internal Server Error"); 
    }
}));


module.exports = router;
