const server = require('../app');
const supertest = require('supertest');
const { pool } = require('../database/connection');
const request = supertest(server);

let studentId = null;
let attendanceId = null;
let lectureId = null;

const truncateTables = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query =
        'SET FOREIGN_KEY_CHECKS=0; ' +
        'TRUNCATE TABLE courses; ' +
        'TRUNCATE TABLE classes; ' +
        'TRUNCATE TABLE users; ' +
        'TRUNCATE TABLE lectures; ' +
        'TRUNCATE TABLE attendance; ' +
        'SET FOREIGN_KEY_CHECKS=1;';
      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
      db.release();
    });
  });
};

const addUser = (class_id, role, email, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query =
        'INSERT INTO users (user_role, email, password, first_name, last_name, date_of_birth, class_id) ' +
        `VALUES("${role}", "${email}", "$2b$15$PGfdEXxNY2M.OSsh1mjIFuy9Tg32Z3Cc5QkKPGIW5f.DNVXpGYwOa", ` +
        `"${firstName}", "${lastName}", "2000-05-29", ${class_id})`;

      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result.insertId);
      });
      db.release();
    });
  });
};

const addClass = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query = 'INSERT INTO classes (name) VALUES("SD22w");';

      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result.insertId);
      });
      db.release();
    });
  });
};

const addCourse = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query = 'INSERT INTO courses (name) VALUES("Development of Large Systems");';

      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result.insertId);
      });
      db.release();
    });
  });
};

const addLecture = (teacherId, courseId, classId) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query =
        'INSERT INTO lectures (teacher_id, start_date_time, course_id, class_id) ' +
        `VALUES("${teacherId}", "${date}", ${courseId}, ${classId});`;

      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result.insertId);
      });
      db.release();
    });
  });
};

const addAttendance = (studentId, lectureId) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, db) => {
      let query =
        'INSERT INTO attendance (user_id, lecture_id, is_attending) ' +
        `VALUES("${studentId}", ${lectureId}, 0);`;

      db.query(query, (error, result, fields) => {
        if (error) {
          reject(error);
        }
        resolve(result.insertId);
      });
      db.release();
    });
  });
};

beforeAll(async () => {
  await truncateTables();
  const courseId = await addCourse();
  const classId = await addClass();
  studentId = await addUser(
    classId,
    'STUDENT',
    'teacher@gmail.com',
    'Andrea',
    'Corradini'
  );
  const teacherId = await addUser(
    classId,
    'TEACHER',
    'jane_doe@stud.kea.dk',
    'Jane',
    'Doe'
  );
  lectureId = await addLecture(teacherId, courseId, classId);
  attendanceId = await addAttendance(studentId, lectureId);
});

describe('/api/lectures/today/:studentId', () => {
  it('should return the lectures for the student on that day after one insert', async () => {
    const res = await request.get(`/api/lectures/today/${studentId}`);

    expect(res.status).toBe(200);
    expect(res._body).toHaveProperty('lectures');
    expect(res._body.lectures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lecture_id: lectureId, attendance_id: attendanceId })
      ])
    );
  });
});

describe('/api/attendance/:attendanceId', () => {
  it('should successfully update the attendance record', async () => {
    const res = await request.patch(`/api/attendance/${attendanceId}`);

    expect(res.status).toBe(200);
    expect(res._body).toHaveProperty('message');
    expect(res._body.message).toEqual('Attendance registered');
  });
});

afterAll(async () => {
  await truncateTables();
  // server.close();
  // await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
