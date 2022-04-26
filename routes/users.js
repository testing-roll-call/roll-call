const router = require('express').Router();
const { pool } = require('../database/connection');
const bcrypt = require("bcrypt");
const { User } = require('../models/User');
const saltRounds = 15;

router.post('/api/users/register', (req, res) => {
    if (!req.body.userRole || (req.body.userRole !== 'TEACHER' && req.body.userRole !== 'STUDENT')) {
        res.send({
            message: 'Please choose the role: TEACHER or STUDENT.',
        });
        return;
    }
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        if (!error) {
            pool.getConnection((err, db) => {
                let query = 'INSERT INTO users (user_role, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
                db.query(query, [req.body.userRole, req.body.email, hash, req.body.firstName, req.body.lastName], (error, result, fields) => {
                    if (result && result.affectedRows === 1) {
                        res.send({
                            message: 'User successfully added.',
                        });
                    } else {
                        res.send({
                            message: 'Something went wrong',
                        });
                    }
                });
                db.release();
            });
        } else {
            res.status(500).send({
                message: "Something went wrong. Try again."
            });
        }
    });
});

router.post('/api/users/login', (req, res) => {
    pool.getConnection((err, db) => {
        let query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [req.body.email], (error, result, fields) => {
            if (result && result.length) {
                bcrypt.compare(req.body.password, result[0].password, (error, match) => {
                    if (match) {
                        res.send({
                            userId: result[0].user_id,
                            role: result[0].user_role,
                            email: result[0].email,
                        });
                    } else {
                        res.status(401).send({
                            message: "Incorrect username or password. Try again."
                        });
                    }
                });
            } else {
                res.send({
                    message: 'Something went wrong',
                });
            }
        });
        db.release();
    });
});

async function getTeacher(db, teacher_id) {
    const teachers = [];
    const result = await new Promise((resolve, reject) => db.query('SELECT users.first_name, users.last_name FROM users  where users.user_id = ?;', teacher_id, (error, result, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }));
    return result;
}

router.get('/api/users/attendance/student/:userId', (req, res) => {
    pool.getConnection((err, db) => {
        let query = 'SELECT users.first_name, users.last_name, teachers_classes.start_date_time, teachers_classes.teacher_id, classes.name, attendance.is_attending, courses.name AS courseName from users join attendance on users.user_id = attendance.user_id join teachers_classes on attendance.class_teacher_id = teachers_classes.class_teacher_id join courses on courses.course_id = teachers_classes.course_id join classes on classes.class_id = teachers_classes.class_id where users.user_id = ?;';
        db.query(query, [req.params.userId], async (error, result, fields) => {
            if (result && result.length) { 
                const attendance = [];
                for (const r of result) {
                    //create new object
                    let entry = { firstName: r.first_name, lastName: r.last_name, classStartDate: r.start_date_time, teacher_name: r.teacher_id, teacher_surname: r.teacher_id, className: r.name, courseName: r.courseName, isAttending: r.is_attending};
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
                    message: 'Something went wrong',
                });
            }
        });
        db.release();
    });
});

function handleStudentStats(attendance) {
    const userStats = {
        "firstName": attendance[0].firstName,
        "lastName": attendance[0].lastName
    }
    attendance.map(value => {
        if (userStats[value.courseName]) {
            ++userStats[value.courseName][0];
            value.isAttending ? ++userStats[value.courseName][1] : '';
        } else {
            userStats[value.courseName] = [];
            userStats[value.courseName][0] = 1;
            userStats[value.courseName][1] = value.isAttending ? 1 : 0;
        }
    });
    Object.keys((userStats)).forEach(key => {
        if (key !== 'firstName' && key !== 'lastName') {
            userStats[key] = Number.parseFloat(userStats[key][1]/userStats[key][0] *100).toFixed(2);
        }
    });
    return userStats;
}

module.exports = {
    router,
  };