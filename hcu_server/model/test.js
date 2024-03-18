const moment = require('moment-timezone');
function setToMidnight() {
    const thaiTime = moment().tz('Asia/Bangkok');
    
    thaiTime.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });
    
    return thaiTime.format(); // Format to ISO 8601
}

console.log(setToMidnight())