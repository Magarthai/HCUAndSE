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



router.post('/getDashboardMonthRange', asyncHandler(async (req, res) => {

    if (req.body.userData.role != "admin") {
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

        // วน loop ตามวันที่ใน range ของเดือนนั้น
        for (let date = startOfMonth.clone(); date.isBefore(endOfMonth); date.add(1, 'day')) {
            const formattedDate = formatDate(date);

            // ตรวจสอบว่าข้อมูลสำหรับวันนี้มีหรือไม่
            if (groupedData.hasOwnProperty(formattedDate)) {
                const listData = groupedData[formattedDate];
                const info = {
                    name: formattedDate,
                    คลินิกทั่วไป: 0,
                    คลินิกเฉพาะทาง: 0,
                    คลินิกกายภาพ: 0,
                    คลินิกฝังเข็ม: 0,
                };

                // นับจำนวนประเภทคลินิกแต่ละประเภท
                listData.forEach(item => {
                    if (item.clinic === "คลินิกทั่วไป") {
                        info.คลินิกทั่วไป++;
                    } else if (item.clinic === "คลินิกเฉพาะทาง") {
                        info.คลินิกเฉพาะทาง++;
                    } else if (item.clinic === "คลินิกกายภาพ") {
                        info.คลินิกกายภาพ++;
                    } else if (item.clinic === "คลินิกฝังเข็ม") {
                        info.คลินิกฝังเข็ม++;
                    }
                });

                data.push(info);
            } else {
                // ถ้าไม่มีข้อมูลสำหรับวันนี้ ให้เพิ่มข้อมูลดีฟอลต์
                const defaultInfo = {
                    name: formattedDate,
                    คลินิกทั่วไป: 0,
                    คลินิกเฉพาะทาง: 0,
                    คลินิกกายภาพ: 0,
                    คลินิกฝังเข็ม: 0,
                };
                data.push(defaultInfo);
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
