const { pool } = require('../database/connection');

const getLecturesOfToday = async (req, res) => {
  await pool.getConnection((err, db) => {
    const now = new Date(); //'2022-05-03 8:39:00'
    const oldDate = new Date(now);
    //10 minutes ago
    oldDate.setMinutes(now.getMinutes() - 10);
    let query = `SELECT lectures.lecture_id, attendance.attendance_id
                        FROM lectures
                        JOIN attendance ON attendance.lecture_id = lectures.lecture_id 
                        WHERE attendance.user_id = ? AND 
                            lectures.start_date_time BETWEEN ? AND ?;`;
    db.query(query, [req.params.studentId, oldDate, now], (error, result, fields) => {
      if (result && result.length) {
        const lectures = [];
        for (const r of result) {
          lectures.push(r);
        }
        res.send({ lectures: lectures });
      } else {
        res.send({
          message: 'Something went wrong'
        });
      }
    });
    db.release();
  });
};

const attendLecture = async (req, res) => {
  await pool.getConnection((err, db) => {
    let query = `UPDATE attendance SET is_attending = 1 WHERE attendance_id = ?;`;
    db.query(query, [req.params.attendanceId], (error, result, fields) => {
      if (result && result.affectedRows === 1) {
        res.send({
          message: 'Attendance registered'
        });
      } else {
        res.send({
          message: 'Something went wrong'
        });
      }
    });
    db.release();
  });
};

module.exports = { getLecturesOfToday, attendLecture };
