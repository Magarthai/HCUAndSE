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

function formatDate(date) {
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



router.post('/appointmentCurrentMonthRangeByClinic', asyncHandler(async (req, res) => {

    if (req.body.userData.role != "admin") {
        res.status(500).send("Internal Server Error");
    }
    try {
        const startOfMonth = moment().startOf('month').tz('Asia/Bangkok');
        const endOfMonth = moment().endOf('month').tz('Asia/Bangkok');
        const clinic = req.body.clinic
        const Dashboards = await Dashboard.find({
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
            clinic: clinic,
        });

        const groupedData = groupBy(Dashboards, 'date');
        console.log(groupedData);
        const data = [];

        // วน loop ตามวันที่ใน range ของเดือนนั้น
        for (let date = startOfMonth.clone(); date.isBefore(endOfMonth); date.add(1, 'day')) {
            const formattedDate = formatDate(date);

            if (clinic == "คลินิกทั่วไป" || clinic == "คลินิกเฉพาะทาง"){
            if (groupedData.hasOwnProperty(formattedDate)) {
                const listData = groupedData[formattedDate];
                const infoGeneral = {
                    name: formattedDate,
                    คลินิกทั่วไป: 0,
                };
                const infoSpecial = {
                    name: formattedDate,
                    คลินิกเฉพาะทาง: 0,
                };
                const infoPhysic = {
                    name: formattedDate,
                    คลินิกกายภาพ: 0,
                };
                const infoNeedle = {
                    name: formattedDate,
                    คลินิกฝังเข็ม: 0,
                };


                // นับจำนวนประเภทคลินิกแต่ละประเภท
                listData.forEach(item => {
                    if (item.clinic === "คลินิกทั่วไป") {
                        infoGeneral.คลินิกทั่วไป++;
                    } else if (item.clinic === "คลินิกเฉพาะทาง") {
                        infoSpecial.คลินิกเฉพาะทาง++;
                    } else if (item.clinic === "คลินิกกายภาพ") {
                        infoPhysic.คลินิกกายภาพ++;
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        infoNeedle.คลินิกฝังเข็ม++;
                    }
                });

                if( clinic == "คลินิกทั่วไป"){
                    data.push(infoGeneral);
                } else if (clinic == "คลินิกเฉพาะทาง") {
                    data.push(infoSpecial);
                } else if (clinic = "คลินิกกายภาพ") {
                    data.push(infoPhysic);
                } else if (clinic = "คลินิกฝังเข็ม") {
                    data.push(infoNeedle);
                }
            } else {
                const infoGeneral = {
                    name: formattedDate,
                    คลินิกทั่วไป: 0,
                };
                const infoSpecial = {
                    name: formattedDate,
                    คลินิกเฉพาะทาง: 0,
                };
                const infoPhysic = {
                    name: formattedDate,
                    คลินิกกายภาพ: 0,
                };
                const infoNeedle = {
                    name: formattedDate,
                    คลินิกฝังเข็ม: 0,
                };

                if( clinic == "คลินิกทั่วไป"){
                    data.push(infoGeneral);
                } else if (clinic == "คลินิกเฉพาะทาง") {
                    data.push(infoSpecial);
                } else if (clinic = "คลินิกกายภาพ") {
                    data.push(infoPhysic);
                } else if (clinic = "คลินิกฝังเข็ม") {
                    data.push(infoNeedle);
                }
            }
            } else {
                if (groupedData.hasOwnProperty(formattedDate)) {
                    const listData = groupedData[formattedDate];
                    const infoPhysic = {
                        name: formattedDate,
                        คลินิกกายภาพ: 0,
                        ปรึกษาแพทย์: 0,
                        ทำกายภาพ: 0
                    };
                    const infoNeedle = {
                        name: formattedDate,
                        คลินิกฝังเข็ม: 0,
                        ปรึกษาแพทย์: 0,
                        ทำฝังเข็ม: 0
                    };
    
                    listData.forEach(item => {
                        if (item.clinic === "คลินิกกายภาพ") {
                            infoPhysic.คลินิกกายภาพ++;
                            if(item.type == "main"){
                                infoPhysic.ทำกายภาพ++;
                            } else {
                                infoPhysic.ปรึกษาแพทย์++;
                            }
                        } else if (item.clinic === "คลินิกฝังเข็ม") {
                            infoNeedle.คลินิกฝังเข็ม++;
                            if(item.type == "main"){
                                infoNeedle.ทำฝังเข็ม++;
                            } else {
                                infoNeedle.ปรึกษาแพทย์++;
                            }
                        }
                    });
    
                    if (clinic === "คลินิกกายภาพ") {
                        data.push(infoPhysic);
                    } else if (clinic === "คลินิกฝังเข็ม") {
                        data.push(infoNeedle);
                    }
                    
                } else {
                    const infoPhysic = {
                        name: formattedDate,
                        คลินิกกายภาพ: 0,
                    };
                    const infoNeedle = {
                        name: formattedDate,
                        คลินิกฝังเข็ม: 0,
                    };

                    if (clinic === "คลินิกกายภาพ") {
                        data.push(infoPhysic);
                    } else if (clinic === "คลินิกฝังเข็ม") {
                        data.push(infoNeedle);
                    }
                    
                }
            }
        }

        // จัดเรียงข้อมูลตามวันที่และส่งคืนข้อมูล
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
