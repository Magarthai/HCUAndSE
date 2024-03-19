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



  router.post('/appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle', asyncHandler(async (req, res) => {

    try {
        const clinic = req.body.clinic
        const currentDate = await setToMidnight();
        const Dashboards = await Dashboard.find({ 
            date: currentDate,
        });

        const groupedData = groupBy(Dashboards, 'clinic');
        console.log(groupedData);
        const infoPhysic = [
                {
                name: 'ปรึกษาแพทย์',
                สำเร็จ: 0,
                ไม่สำเร็จ: 0,
               
              },
              {
                name: 'ทำกายภาพ',
                สำเร็จ: 0,
                ไม่สำเร็จ: 0,
               
              },
        ]
        const infoNeedle = [
            {
                name: 'ปรึกษาแพทย์',
                สำเร็จ: 0,
                ไม่สำเร็จ: 0,
               
              },
              {
                name: 'ทำฝังเข็ม',
                สำเร็จ: 0,
                ไม่สำเร็จ: 0,
               
              },
        ]
        for (const key in groupedData) {
            if (groupedData.hasOwnProperty(key)) {
                const listData = groupedData[key];
                

                listData.forEach(item => {
                    console.log(item.status);
                    if (item.clinic === "คลินิกกายภาพ") {
                        if(item.type == "main"){
                            if(item.status === "เสร็จสิ้น"){
                                infoPhysic[1].สำเร็จ++;
                            } else {
                                infoPhysic[1].ไม่สำเร็จ++;
                            }
                        } else {
                            if(item.status === "เสร็จสิ้น"){
                                infoPhysic[0].สำเร็จ++;
                            } else {
                                infoPhysic[0].ไม่สำเร็จ++;
                            }
                        }
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        if(item.type == "main"){
                            if(item.status === "เสร็จสิ้น"){
                                infoNeedle[1].สำเร็จ++;
                            } else {
                                infoNeedle[1].ไม่สำเร็จ++;
                            }
                        } else {
                            if(item.status === "เสร็จสิ้น"){
                                infoNeedle[0].สำเร็จ++;
                            } else {
                                infoNeedle[0].ไม่สำเร็จ++;
                            }
                        }
                    }
                });

            }
        }
            if (clinic === "คลินิกกายภาพ"){
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

