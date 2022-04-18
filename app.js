// setup express
const express = require('express');
const app = express();

// Utils class
const { Utils } = require('./models/Utils');
const Utilities = new Utils();

// database setup
const db = require('./database/connection').connection;

// setup static dir
app.use(express.static(`${__dirname}`));

// allows to recognise incoming object as json object
app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

const classAttendanceCode = {};

app.get('/attendanceCode', (req, res) => {
  const classTeacherId = req.body.classTeacherId;
  let code;
  // prevent duplicate codes
  do {
      code = Utilities.generateCode(10);
  } while (classAttendanceCode[code])
  classAttendanceCode[code] = classTeacherId;
  res.send({code: code})
})

const PORT = process.env.PORT || 8080;
/* eslint-disable no-debugger, no-console */
app.listen(PORT, (error) => {
    if (error) {
      console.log(error);
    }
    console.log('Server is running on port', Number(PORT));
});