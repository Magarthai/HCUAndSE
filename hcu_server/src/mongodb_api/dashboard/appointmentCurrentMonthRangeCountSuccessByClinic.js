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



  router.post('/appointmentCurrentMonthRangeCountSuccessByClinic', asyncHandler(async (req, res) => {

    try {
        const clinic = req.body.clinic
        const selectedDate = req.body.selectedDate
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
            clinic: clinic,
        });

        const groupedData = groupBy(Dashboards, 'clinic');
        console.log(groupedData);
        const infoGeneral = [
            {
                name: 'สําเร็จ',
                value: 0,
            }, 
            {
                name: 'ไม่สำเร็จ',
                value: 0,
            }, 
        ]
        const infoSpecial = [
            {
                name: 'สําเร็จ',
                value: 0,
            }, 
            {
                name: 'ไม่สำเร็จ',
                value: 0,
            }, 
        ]
        const infoPhysic = [
            {
                name: 'ทำกายภาพ',
                value: 0,
            }, 
            {
                name: 'ปรึกษาแพทย์',
                value: 0,
            }, 
        ]
        const infoNeedle = [
            {
                name: 'ทำฝังเข็ม',
                value: 0,
            }, 
            {
                name: 'ปรึกษาแพทย์',
                value: 0,
            }, 
        ]
        const dataList = [];
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const listData = groupedData[key];
                

                listData.forEach(item => {
                    console.log(item.status,"XD");
                    if (item.clinic === "คลินิกทั่วไป") {
                        if(item.status == "เสร็จสิ้น"){
                            infoGeneral[0].value++;
                        } else if (item.status == "ไม่สำเร็จ") {
                            infoGeneral[1].value++;
                        }
                    } else if (item.clinic === "คลินิกเฉพาะทาง") {
                        if(item.status == "เสร็จสิ้น"){
                            infoSpecial[0].value++;
                        } else if (item.status == "ไม่สำเร็จ") {
                            infoSpecial[1].value++;
                        }
                    } else if (item.clinic === "คลินิกกายภาพ") {
                        if(item.type == "main"){
                            infoPhysic[0].value++;
                        } else if (item.type == "talk") {
                            infoPhysic[1].value++;
                        }
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        if(item.type == "main"){
                            infoNeedle[0].value++;
                        } else if (item.type == "talk"){
                            infoNeedle[1].value++;
                        }
                    }
                });

            }
        }
            if (clinic === "คลินิกทั่วไป") {
                res.json(infoGeneral);;
            } else if (clinic === "คลินิกเฉพาะทาง"){
                res.json(infoSpecial);
            } else if (clinic === "คลินิกกายภาพ"){
                res.json(infoPhysic);
            } else if (clinic === "คลินิกฝังเข็ม"){
                res.json(infoNeedle);
            } else {
                res.status(500).send("Internal Server Error"); 
            }

        
    } catch (error) {
        console.log(error, "getDashboardMonthRange");
        res.status(500).send("Internal Server Error"); 
    }
}));


module.exports = router;