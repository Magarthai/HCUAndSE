const moment = require('moment-timezone');

// ดึงเวลาปัจจุบัน
let currentTime = moment();

// กำหนดเขตเวลาเป็นประเทศไทย
let thaiTime = currentTime.tz('Asia/Bangkok');

console.log(thaiTime,"thai");
