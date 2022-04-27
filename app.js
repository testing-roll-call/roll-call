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

// create server and set up the sockets on the server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

//timeout would start on client after receiving the code
//after 10 minutes it would send this request to the backend to delete code
app.delete('/attendanceCode', (req, res) => {
  const code = req.body.code;
  delete classAttendanceCode[code];
  res.send({code: code})
})

io.on('connection', (socket) => {
  
  function handleGenerateCode() {
    let code;
    // prevent duplicate codes
    do {
        code = Utilities.generateCode(10);
    } while (io.sockets.adapter.rooms.get(code))
    socket.join(code);
    socket.emit('codeGenerated', code);
  }

  function handleDeleteCode(code) {
    io.sockets.clients(code).forEach(function(client) {
      client.leave(code);
    });
  }

  function handleAttendLecture() {

  }

  socket.on('generateCode', handleGenerateCode);
  socket.on('deleteCode', handleDeleteCode);
  socket.on('attendLecture', handleAttendLecture);
});

const PORT = process.env.PORT || 8080;
/* eslint-disable no-debugger, no-console */
server.listen(PORT, (error) => {
    if (error) {
      console.log(error);
    }
    console.log('Server is running on port', Number(PORT));
});