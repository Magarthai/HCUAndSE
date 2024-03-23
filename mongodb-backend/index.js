const express = require('express');
const dbConnect = require('./config/db.connector');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require('morgan');
const createUser = require('./controllers/Auth/Register.crlt');
const checkStudentIdExits = require('./controllers/Auth/CheckStudentIdExits');

const PORT = process.env.PORT;
const createHoliday = require('./controllers/Holiday/CreateHoliday');
const deleteHoliday = require('./controllers/Holiday/DeleteHoliday');
const checkDateHoliday = require('./controllers/Holiday/CheckDateHoliday');
const getHoliday = require('./controllers/Holiday/GetHoliday');
const createFeedback = require('./controllers/Feedback/feedbackSubmit');
const getFeedbackTimeRange = require('./controllers/Feedback/getFeedbackTimeRange');
const getFeedbackTimeRangeByClinic = require('./controllers/Feedback/getFeedbackTimeRangeByClinic');
const getFeedbackManyType = require('./controllers/Feedback/getFeedbackManyType');
const getFeedbackCurrentDateByClinic = require('./controllers/Feedback/getFeedbackCurrentDateByClinic');
const getFeedbackTimeRangeData2 = require('./controllers/Feedback/getFeedbackTimeRangeData2');
const getFeedbackTimeRangeTodayRange = require('./controllers/Feedback/getFeedbackTimeRangeTodayRange');
const getFeedbackTimeRangeToday = require('./controllers/Feedback/getFeedbackTimeRangeToday');
const getFeedbackTodayGetByClinicScore1 = require('./controllers/Feedback/getFeedbackTodayGetByClinicScore1');
const getFeedbackTodayGetByClinicScore2 = require('./controllers/Feedback/getFeedbackTodayGetByClinicScore2');
const getFeedbackTimeRangeGetByClinicScore1 = require('./controllers/Feedback/getFeedbackTimeRangeGetByClinicScore1');
const getFeedbackTimeRangeGetByClinicScore2 = require('./controllers/Feedback/getFeedbackTimeRangeGetByClinicScore2');
const getFeedbackTimeRangeGetByClinicPhysicNeedle = require('./controllers/Feedback/getFeedbackTimeRangeGetByClinicPhysicNeedle');
const getFeedbackTodayGetByClinicPhysicNeedle = require('./controllers/Feedback/getFeedbackTodayGetByClinicPhysicNeedle');
const cors = require('cors');
app.use(cors());
dbConnect();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', createUser);
app.use('/api', createHoliday);
app.use('/api', checkStudentIdExits);
app.use('/api', getHoliday);
app.use('/api', deleteHoliday);
app.use('/api', checkDateHoliday);
app.use('/api', createFeedback);
app.use('/api', getFeedbackTimeRange);
app.use('/api', getFeedbackTimeRangeByClinic);
app.use('/api', getFeedbackManyType);
app.use('/api', getFeedbackCurrentDateByClinic);
app.use('/api', getFeedbackTimeRangeData2);
app.use('/api', getFeedbackTimeRangeTodayRange);
app.use('/api', getFeedbackTimeRangeToday);
app.use('/api', getFeedbackTodayGetByClinicScore1);
app.use('/api', getFeedbackTodayGetByClinicScore2);
app.use('/api', getFeedbackTimeRangeGetByClinicScore1);
app.use('/api', getFeedbackTimeRangeGetByClinicScore2);
app.use('/api', getFeedbackTimeRangeGetByClinicPhysicNeedle);
app.use('/api', getFeedbackTodayGetByClinicPhysicNeedle);
app.get('/', (req, res) => {
    res.send('test')
})
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});