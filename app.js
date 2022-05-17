// setup express
const express = require('express');
const app = express();

const cors = require('cors')
const cookieParser = require("cookie-parser");

app.use(cors({origin: "*"}));

// allows to recognise incoming object as json object
app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

// allows to create a cookie parser middleware
app.use(cookieParser());

// Utils class
const { Utils } = require('./models/Utils');
const Utilities = new Utils();

// middlewares
const requireAuth = require('./middlewares/requireAuth');

//routers
const classRoutes = require("./routes/classes.js");
const userRoutes = require("./routes/users.js");

app.use(userRoutes.router);
app.use(classRoutes.router);

const fetch = require('node-fetch');

// create server and set up the sockets on the server
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.get('/', (req, res) => {
  const object = {key: 'response from api'};
    res.send(object);
});

io.on('connection', (socket) => {
  function handleGenerateCode(lectureId) {
      let code;
      // prevent duplicate codes
      do {
          code = Utilities.generateCode(10);
      } while (io.sockets.adapter.rooms.get(`${code}-${lectureId}`))
      socket.join(`${code}-${lectureId}`);
      socket.emit('codeGenerated', {code, lectureId});
  }

  function handleDeleteCode(data) {
      io.sockets.adapter.rooms.get(`${data.code}-${data.lectureId}`).forEach(function(client) {
          io.sockets.sockets.get(client).leave(`${data.code}-${data.lectureId}`);
      });
  }

  async function handleAttendLecture(data) {
      //select from database all unique lecture_ids for today - limit time somehow - start within 30 minutes ago
      let url = `http://localhost:8080/api/lectures/today/${data.student.studentId}`;
      response = await fetch(url);
      result = await response.json();
      //look whether room with code and id exists - if yes then join else send error
      if (!result.message) {
          const lectureIds = result.lectures;
          const lectureId = lectureIds.find(id => io.sockets.adapter.rooms.get(`${data.code}-${id.lecture_id}`));
          if (lectureId) {
              await studentAttendsAndJoins(data, lectureId);
          } else {
              socket.emit('joinFailed');
          }
      } else {
          socket.emit('joinFailed');
      }
  }

  async function studentAttendsAndJoins(data, lectureId) {
      //student part of the room - join room and update attendance
      socket.join(`${data.code}-${lectureId.lecture_id}`);
      let url = `http://localhost:8080/api/attendance/${lectureId.attendance_id}`;
      response = await fetch(url, {
          method: 'patch'
      });
      result = await response.json();
      if (result.message === 'Attendance registered'){
          socket.emit('joinSuccessful');
          io.to(`${data.code}-${lectureId.lecture_id}`).emit('studentJoined', data.student);
      } else {
          socket.emit('joinFailed');
      }
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
