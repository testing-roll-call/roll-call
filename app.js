// setup express
const express = require('express');
const app = express();

// database setup
const db = require('./database/connection').connection;

// setup static dir
app.use(express.static(`${__dirname}`));

// set up session
const session = require('express-session');

app.use(session({
  secret: 'requiredSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// allows to recognise incoming object as json object
app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

//routers
const userRoutes = require("./routes/users.js");
const handleSession = require('./routes/session.js');

app.use(handleSession.router);
app.use(userRoutes.router);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

const PORT = process.env.PORT || 8080;
/* eslint-disable no-debugger, no-console */
app.listen(PORT, (error) => {
    if (error) {
      console.log(error);
    }
    console.log('Server is running on port', Number(PORT));
});