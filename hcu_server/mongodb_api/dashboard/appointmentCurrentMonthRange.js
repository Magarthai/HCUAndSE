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
      const group = formatDate(obj[key]);
      
      acc[group] = acc[group] || [];
      acc[group].push(obj);
      return acc;
    }, {});
  }



  router.post('/getDashboardMonthRange', asyncHandler(async (req, res) => {

    if (req.body.userData.role != "admin"){
        res.status(500).send("Internal Server Error"); 
    }
    try {
        const startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        const endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

        const Dashboards = await Dashboard.find({ 
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
        });

        const groupedData = groupBy(Dashboards, 'date');
        console.log(groupedData);
        const data = [];

        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const listData = groupedData[key];
                const info = {
                    name: key,
                    general: 0,
                    special: 0,
                    physic: 0,
                    needle: 0,
                };

                listData.forEach(item => {
                    if (item.clinic === "คลินิกทั่วไป") {
                        info.general++;
                    } else if (item.clinic === "คลินิกเฉพาะทาง") {
                        info.special++;
                    } else if (item.clinic === "คลินิกกายภาพ") {
                        info.physic++;
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        info.needle++;
                    }
                });

                data.push(info);
            }
        }
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.name.split('/').reverse().join('-'));
            const dateB = new Date(b.name.split('/').reverse().join('-'));
            return dateA - dateB;
        });
        res.json(sortedData);
    } catch (error) {
        console.log(error, "getDashboardMonthRange");
        res.status(500).send("Internal Server Error"); 
    }
}));


module.exports = router;
