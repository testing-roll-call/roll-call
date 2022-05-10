const router = require('express').Router();
const { pool } = require('../database/connection');

router.get('/api/classes/today/:userId', (req, res) => {
    pool.getConnection((err, db) => {
        const now = new Date();//'2022-05-03 8:45:00'
        const oldDate = new Date(now);
        //10 minutes ago
        oldDate.setMinutes(now.getMinutes() - 10);
        let query = `SELECT teachers_classes.class_teacher_id, attendance.attendance_id
                        FROM teachers_classes
                        JOIN attendance ON attendance.class_teacher_id = teachers_classes.class_teacher_id 
                        WHERE attendance.user_id = ? AND 
                            teachers_classes.start_date_time BETWEEN ? AND ?;`
        db.query(query, [req.params.userId, oldDate, now], (error, result, fields) => {
            if (result && result.length) { 
                const classes = [];
                for (const r of result) {
                    classes.push(r);
                }
                res.send({classes: classes});
            } else {
                res.send({
                    message: 'Something went wrong',
                });
            }
        });
        db.release();
    });
});

router.patch('/api/attendance/:attendanceId', (req, res) => {
    pool.getConnection((err, db) => {
        let query = `UPDATE attendance SET is_attending = 1 WHERE attendance_id = ?;`
        db.query(query, [req.params.attendanceId], (error, result, fields) => {
            if (result && result.affectedRows === 1) { 
                res.send({
                    message: 'Attendance registered'
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

module.exports = {
    router,
};