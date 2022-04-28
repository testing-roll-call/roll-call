const router = require('express').Router();
const { pool } = require('../database/connection');

router.get('/api/classes/today/:userId', (req, res) => {
    pool.getConnection((err, db) => {
        const now = new Date();
        const oldDate = new Date(now);
        //30 minutes ago
        oldDate.setMinutes(now.getMinutes() - 30);
        let query = `SELECT teachers_classes.class_teacher_id, teachers_classes.start_date_time
                        FROM teachers_classes
                        JOIN attendance ON attendance.class_teacher_id = teachers_classes.class_teacher_id 
                        WHERE attendance.user_id = ? AND 
                            teachers_classes.start_date_time BETWEEN ? AND ?;`
        db.query(query, [req.params.userId, oldDate, now], async (error, result, fields) => {
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
