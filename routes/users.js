const router = require('express').Router();
const { pool } = require('../database/connection');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const requireAuth = require('../middlewares/requireAuth');
const jwt = require('jsonwebtoken');

const saltRounds = 15;

router.post('/api/users/register', (req, res) => {
  const { email, password, firstName, lastName, userRole, classId } = req.body;

  try {
    if (!userRole || (userRole !== 'TEACHER' && userRole !== 'STUDENT')) {
      res.send({
        message: 'Please choose the role: TEACHER or STUDENT.'
      });
      return;
    }

    bcrypt.hash(password, saltRounds, (error, hash) => {
      if (!error) {
        pool.getConnection((err, db) => {
          let query =
            'INSERT INTO users (user_role, email, password, first_name, last_name, class_id) VALUES (?, ?, ?, ?, ?, ?)';

          db.query(
            query,
            [userRole, email, hash, firstName, lastName, classId],
            (error, result, fields) => {
              if (result && result.affectedRows === 1) {
                const token = jwt.sign(
                  {
                    user_id: result.insertId,
                    email,
                    firstName,
                    lastName,
                    userRole,
                    classId
                  },
                  process.env.JWT_SECRET
                );

                res.status(201).send({ token });
              } else {
                res.send({
                  message: 'Something went wrong'
                });
              }
            }
          );

          db.release();
        });
      } else {
        res.status(500).send({
          message: 'Something went wrong. Try again.'
        });
      }
    });
  } catch (e) {
    return res.status(422).send(e.message);
  }
});

router.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  try {
    pool.getConnection((err, db) => {
      let query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], (error, result, fields) => {
        if (result && result.length) {
          bcrypt.compare(password, result[0].password, (error, match) => {
            if (match) {
              const token = jwt.sign(
                {
                  userId: result[0].user_id,
                  role: result[0].user_role,
                  email,
                  firstName: result[0].first_name,
                  lastName: result[0].last_name
                },
                process.env.JWT_SECRET
              );

              res.status(200).send({ token });
            } else {
              return res.status(401).send({ error: 'Invalid password or email' });
            }
          });
        } else {
          return res.status(401).send({ error: 'Invalid password or email' });
        }
      });
      db.release();
    });
  } catch (e) {
    return res.status(401).send({ error: 'Invalid password or email' });
  }
});

async function getTeacher(db, teacher_id) {
  const result = await new Promise((resolve, reject) =>
    db.query(
      'SELECT users.first_name, users.last_name FROM users  where users.user_id = ?;',
      teacher_id,
      (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    )
  );
  return result;
}

//get attendance for student by student id
router.get('/api/users/students/attendance/:studentId', requireAuth, (req, res) => {
  pool.getConnection((err, db) => {
    let query =
      'SELECT users.first_name, users.last_name, lectures.start_date_time, lectures.teacher_id, classes.name, attendance.is_attending, courses.name AS courseName from users join attendance on users.user_id = attendance.user_id join lectures on attendance.lecture_id = lectures.lecture_id join courses on courses.course_id = lectures.course_id join classes on classes.class_id = lectures.class_id where users.user_id = ?;';
    db.query(query, [req.params.studentId], async (error, result, fields) => {
      if (result && result.length) {
        const attendance = [];
        for (const r of result) {
          //create new object
          let entry = {
            firstName: r.first_name,
            lastName: r.last_name,
            classStartDate: r.start_date_time,
            teacher_name: r.teacher_id,
            teacher_surname: r.teacher_id,
            className: r.name,
            courseName: r.courseName,
            isAttending: r.is_attending
          };
          result = await getTeacher(db, r.teacher_id);
          if (result && result.length) {
            entry.teacher_name = result[0].first_name;
            entry.teacher_surname = result[0].last_name;
            attendance.push(entry);
          }
        }
        res.send(handleStudentStats(attendance));
      } else {
        res.send({
          message: 'Something went wrong'
        });
      }
    });
    db.release();
  });
});

function handleStudentStats(attendance) {
  const userStats = {
    firstName: attendance[0].firstName,
    lastName: attendance[0].lastName
  };
  attendance.map((value) => {
    if (userStats[value.courseName]) {
      ++userStats[value.courseName][0];
      value.isAttending ? ++userStats[value.courseName][1] : '';
    } else {
      userStats[value.courseName] = [];
      userStats[value.courseName][0] = 1;
      userStats[value.courseName][1] = value.isAttending ? 1 : 0;
    }
  });
  Object.keys(userStats).forEach((key) => {
    if (key !== 'firstName' && key !== 'lastName') {
      userStats[key] = Number.parseFloat(
        (userStats[key][1] / userStats[key][0]) * 100
      ).toFixed(2);
    }
  });
  return userStats;
}

//show number of students in the class
router.get('/api/users/students/:classId', requireAuth, (req, res) => {
  pool.getConnection((err, db) => {
    let query =
      'SELECT COUNT(users.email) AS studentCount from users join classes on users.class_id = classes.class_id where classes.class_id = ?;';
    db.query(query, [req.params.classId], async (error, result, fields) => {
      if (result && result.length) {
        res.send(result[0]);
      } else {
        res.send({
          message: 'Something went wrong'
        });
      }
    });
    db.release();
  });
});

//get todays lectures for teacher with course name and time
router.get('/api/users/lectures/:teacherId', requireAuth, (req, res) => {
  pool.getConnection((err, db) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let query =
      'SELECT lectures.lecture_id, courses.name, lectures.start_date_time from courses join lectures on courses.course_id = lectures.course_id where lectures.teacher_id = ? AND DATE(lectures.start_date_time) = ?;';
    db.query(
      query,
      [req.params.teacherId, `${yyyy}-${mm}-${dd}`],
      async (error, result, fields) => {
        console.log(result);
        if (result && result.length) {
          const todayClasses = result.map((c) => {
            return {
              lecture_id: c.lecture_id,
              name: c.name,
              start_date_time: c.start_date_time
            };
          });
          res.send(todayClasses);
        } else {
          res.send({
            message: 'Something went wrong'
          });
        }
      }
    );
    db.release();
  });
});

//get all classes and courses combinations for teacher statistics dropdown
router.get('/api/users/classes/courses/all/:teacherId', requireAuth, (req, res) => {
  pool.getConnection((err, db) => {
    let query =
      'SELECT DISTINCT courses.name AS courseName, classes.name AS className, courses.course_id, classes.class_id from courses join lectures on courses.course_id = lectures.course_id join classes on classes.class_id = lectures.class_id where lectures.teacher_id = ?;';
    db.query(query, [req.params.teacherId], async (error, result, fields) => {
      if (result) {
        res.send(result);
      } else {
        res.send({
          message: 'Something went wrong'
        });
      }
    });
    db.release();
  });
});

//get attendance for teacher page by teacher id
router.post('/api/users/teachers/attendance/:teacherId', requireAuth, (req, res) => {
  pool.getConnection((err, db) => {
    let query = `SELECT users.first_name, users.last_name, users.email, lectures.start_date_time, attendance.is_attending
                    FROM users 
                    JOIN attendance ON users.user_id = attendance.user_id 
                    JOIN lectures ON attendance.lecture_id = lectures.lecture_id 
                    JOIN courses ON courses.course_id = lectures.course_id 
                    JOIN classes ON classes.class_id = lectures.class_id 
                    WHERE lectures.teacher_id = ? AND 
                        lectures.class_id = ? AND
                        lectures.course_id = ?;`;
    db.query(
      query,
      [req.params.teacherId, req.body.data.class_id, req.body.data.course_id],
      async (error, result, fields) => {
        if (result && result.length) {
          const attendance = [];
          for (const r of result) {
            //create new object
            attendance.push({
              firstName: r.first_name,
              lastName: r.last_name,
              email: r.email,
              classStartDate: r.start_date_time,
              isAttending: r.is_attending
            });
          }
          date = new Date();
          const classAttendance = calculateClassAttendanceBetweenDates(
            attendance,
            date,
            new Date(0)
          );
          let oldDate = new Date(date);
          //get date one month ago
          oldDate.setMonth(date.getMonth() - 1);
          //set to midnight
          oldDate.setHours(0, 0, 0, 0);
          const monthlyAttendance = calculateClassAttendanceBetweenDates(
            attendance,
            date,
            oldDate
          );
          oldDate = new Date(date);
          //get date one month ago
          oldDate.setDate(date.getDate() - 7);
          //set to midnight
          oldDate.setHours(0, 0, 0, 0);
          const weeklyAttendance = calculateClassAttendanceBetweenDates(
            attendance,
            date,
            oldDate
          );
          const studentsAttendance = calculateStudentsAttendance(attendance);
          res.send({
            classAttendance,
            monthlyAttendance,
            weeklyAttendance,
            studentsAttendance
          });
        } else {
          res.send({
            message: 'Something went wrong'
          });
        }
      }
    );
    db.release();
  });
});
//if it is split it will loop through whole result set multiple times, else these methods could be joined into 1, but then 1 method will do many things
function calculateClassAttendanceBetweenDates(attendance, date, oldDate) {
  let attending = 0;
  let notAttending = 0;
  attendance.map((user) => {
    if (user.classStartDate <= date && user.classStartDate >= oldDate) {
      user.isAttending ? attending++ : notAttending++;
    }
  });
  const maxAttendance = attending + notAttending || 1; //avoid division by 0
  return Number.parseFloat((attending / maxAttendance) * 100).toFixed(2);
}

function calculateStudentsAttendance(attendance) {
  const userAttendance = {};
  attendance.map((user) => {
    if (userAttendance[user.email]) {
      ++userAttendance[user.email][0];
      user.isAttending ? ++userAttendance[user.email][1] : '';
    } else {
      userAttendance[user.email] = [
        1,
        user.isAttending ? 1 : 0,
        user.firstName,
        user.lastName
      ];
    }
  });
  Object.keys(userAttendance).forEach((key) => {
    if (userAttendance[key][0] === 0 || !userAttendance[key][0])
      userAttendance[key][0] = 1; //avoid division by 0
    userAttendance[key] = {
      firstName: userAttendance[key][2],
      lastName: userAttendance[key][3],
      attendance: Number.parseFloat(
        (userAttendance[key][1] / userAttendance[key][0]) * 100
      ).toFixed(2)
    };
  });

  return userAttendance;
}

module.exports = {
  router
};
