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
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());
dbConnect();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', createUser);
app.use('/api', checkStudentIdExits);


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});