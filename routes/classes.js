const router = require('express').Router();
const { getLecturesOfToday, attendLecture } = require('../controllers/classesController');

// lectures for the student happening today
router.get('/api/lectures/today/:studentId', getLecturesOfToday);

// attend lecture as a student
router.patch('/api/attendance/:attendanceId', attendLecture);

module.exports = {
  router
};
