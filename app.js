// setup express
const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors({origin: "*"})); // https://www.youtube.com/watch?v=PNtFSVU-YTI

// database setup
const { pool } = require('./database/connection');


// setup static dir
// app.use(express.static(`${__dirname}`));

// allows to recognise incoming object as json object
app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const object = {key: 'response from api'};
    res.send(object);
});

const PORT = process.env.PORT || 8080;
/* eslint-disable no-debugger, no-console */
app.listen(PORT, (error) => {
    if (error) {
      console.log(error);
    }
    console.log('Server is running on port', Number(PORT));
});