const server = require("../app");
const supertest = require("supertest");
const request = supertest(server);

const {pool} = require('../database/connection');

// beforeAll(() => {
//   // Connect to DB
//   pool.getConnection();
// });

// returns a string representing a datetime on the same day
const getDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + String((today.getMonth() + 1)).padStart(2, '0') + '-' + String((today.getDate())).padStart(2, '0');
    const time = String(today.getHours() + 5).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0');
    return `${date} ${time}`;
}

const saveTeacherToDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query =
                'INSERT INTO users (first_name, last_name, email, user_role, password, class_id) ' +
                'VALUES ("Kane", "Vasquez", "tester@yhoo.com", "TEACHER", "$2b$15$PGfdEXxNY2M.OSsh1mjIFuy9Tg32Z3Cc5QkKPGIW5f.DNVXpGYwOa", NULL);';
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(result.insertId);
            });
            db.release();
        });
    })
}

// const createCourse = () => {
//   pool.getConnection( async (err, db) => {
//     const createCourseQuery = `
//       INSERT INTO courses (name)
//       VALUES ('TEST Course');
//     `;
//     const result = await db.query(createCourseQuery);
//     console.log("result", result)
//     return result;
//   });
// };

const saveStudentToDB = async() => {
  pool.getConnection((err, db) => {
    const createStudentQuery = `
      INSERT INTO users (user_role, email, password, first_name, last_name, date_of_birth, class_id)
      VALUES ('STUDENT', 'test@email.com', 'test_password', 'test first name', 'test last name', ${new Date('2022-04-20')} )
    `;
  });
};

const saveLectureToDB = (teacherId, dateTime) => {
    let lecture = {
        lecture_id: undefined,
        start_date_time: dateTime,
        course_id: 1,
        class_id: 1,
    }
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO lectures (teacher_id, start_date_time, course_id, class_id) VALUES (${teacherId},"${dateTime}", 1, 1);`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    console.log('error inserting lecture...')
                    reject(error);
                }
                lecture.lecture_id = result.insertId;
                resolve(lecture);
            });
            db.release();
        });
    })
}

const saveCoursesToDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO courses (course_id, name) VALUES (1, 'Development of Large Systems'),(2, 'Databases for Developers'),(3, 'Testing');`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    console.log('error inserting courses...', error)
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteLectureFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM lectures;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteTeacherFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM users;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
               } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteCoursesFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM courses;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

// describe('teacher tests', () => {

//     test("GET /api/users/lectures/:teacherId", async () => {
//         const dateTime = getDateTime();
//         await saveCoursesToDB();
//         const teacherId = await saveTeacherToDB();
//         const lecture = await saveLectureToDB(teacherId, dateTime);
//         await supertest(server).get(`/api/users/lectures/${teacherId}`)
//             .expect(200)
//             .then((response) => {
//                 expect(Array.isArray(response.body)).toBeTruthy();
//                 expect(response.body.lecture_id).toEqual(lecture.lecture_id);
//                 expect(response.body.start_date_time).toEqual(dateTime);
//                 expect(response.body.name).toEqual('Development of Large Systems');
//             }).catch(async (error) => {
//                 console.log(error.stack());
//             });
//         await deleteLectureFromDB(teacherId);
//         await deleteTeacherFromDB(teacherId);
//         await deleteCoursesFromDB();
//     }, 20000);

//     test("GET /api/users/classes/courses/all/:teacherId", async () => {
//         const dateTime = getDateTime();
//         await saveCoursesToDB();
//         const teacherId = await saveTeacherToDB();
//         console.log('teacher', teacherId)
//         const lecture = await saveLectureToDB(teacherId, dateTime);
//         console.log('lecture', lecture)
//         await supertest(server).get(`/api/users/classes/courses/all/${teacherId}`)
//             .expect(200)
//             .then((response) => {
//                 expect(Array.isArray(response.body)).toBeTruthy();
//                 expect(response.body.course_id).toEqual(1);
//                 expect(response.body.class_id).toEqual(1);
//                 expect(response.body.courseName).toEqual('Development of Large Systems');
//             }).catch(async (error) => {
//                 console.log(error.stack())
//             });
//         await deleteLectureFromDB(teacherId);
//         await deleteTeacherFromDB(teacherId);
//         await deleteCoursesFromDB();
//     }, 20000);

//     afterAll(()=> {
//         pool.end();
//     });
// });

describe('student integration tests', () => {
  // make it as a transaction

  test("GET /api/users/students/attendance/:studentId", async () => {
    //create course 
    console.log('=======================================================')
    // const course = createCourse();
    // console.log('course', course);

    // create new student query

    // create new attendance for that student
    let accessToken = '';
    try {
      const registerResponse = await request.post('/api/users/login').send({
        "email": "v-kane@yahoo.com",
        "password": "JmE95osSMM4bYF"
      });
      accessToken = registerResponse._body.accessToken;
    } catch (error) {
      console.log(error);
    }
    
    try {
      if (accessToken) {
        const result = await request.get('/api/users/students/attendance/27').set({Authorization: "Bearer " + accessToken});
        console.log(result._body);
      } else {
        console.log("No access token");
      }
    } catch (error) {
      console.log(error);
    }

    // done();
  }, 20000);

  afterAll(()=> {
      pool.end();
  });

});
