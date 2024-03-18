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



  router.get('/getDashboardMonthRangeCountNeedlePhysic', asyncHandler(async (req, res) => {

    try {
        const startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        const endOfMonth = moment().endOf('month').tz('Asia/Bangkok');

        const Dashboards = await Dashboard.find({ 
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
        });

        const groupedData = groupBy(Dashboards, 'clinic');
        console.log(groupedData);
        const data = [];
        const infoGeneral = {
            name: 'คลินิกทั่วไป',
            สำเร็จ: 0,
            ไม่สำเร็จ: 0,
          };
        const infoSpecial = {
            name: 'คลินิกเฉพาะทาง',
            สำเร็จ: 0,
            ไม่สำเร็จ: 0,
        };
        const infoPhysic = {
            name: 'คลินิกกายภาพ',
            สำเร็จ: 0,
            ไม่สำเร็จ: 0,
        };
        const infoNeedle = {
            name: 'คลินิกฝังเข็ม',
            สำเร็จ: 0,
            ไม่สำเร็จ: 0,
        };
        const dataList = [];
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const listData = groupedData[key];
                

                listData.forEach(item => {
                    console.log(item.status);
                    if (item.clinic === "คลินิกทั่วไป") {
                        if(item.status == "เสร็จสิ้น"){
                            infoGeneral.สำเร็จ++;
                        } else {
                            infoGeneral.ไม่สำเร็จ++;
                        }
                    } else if (item.clinic === "คลินิกเฉพาะทาง") {
                        if(item.status == "เสร็จสิ้น"){
                            infoSpecial.สำเร็จ++;
                        } else {
                            infoSpecial.ไม่สำเร็จ++;
                        }
                    } else if (item.clinic === "คลินิกกายภาพ") {
                        if(item.status == "เสร็จสิ้น"){
                            infoPhysic.สำเร็จ++;
                        } else {
                            infoPhysic.ไม่สำเร็จ++;
                        }
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        if(item.status == "เสร็จสิ้น"){
                            infoNeedle.สำเร็จ++;
                        } else {
                            infoNeedle.ไม่สำเร็จ++;
                        }
                    }
                });

            }
        }
        dataList.push(infoGeneral);
        dataList.push(infoSpecial);
        dataList.push(infoPhysic);
        dataList.push(infoNeedle);

        res.json(dataList);
    } catch (error) {
        console.log(error, "getDashboardMonthRange");
        res.status(500).send("Internal Server Error"); 
    }
}));


module.exports = router;
