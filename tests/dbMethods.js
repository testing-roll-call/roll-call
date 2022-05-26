const {pool} = require('../database/connection');

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

const saveLectureToDB = (teacherId, dateTime, courseId, classId) => {
    let lecture = {
        lecture_id: undefined,
        start_date_time: dateTime,
        course_id: courseId,
        class_id: classId,
    }
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO lectures (teacher_id, start_date_time, course_id, class_id) VALUES (${teacherId},"${dateTime}", ${courseId}, ${classId});`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                lecture.lecture_id = result.insertId;
                resolve(lecture);
            });
            db.release();
        });
    })
}

const saveCourseToDB = (id, name) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO courses (course_id, name) VALUES (${id}, '${name}');`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
            db.release();
        });
    })
}

const saveClassToDB = (id, name) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO classes (class_id, name) VALUES (${id}, '${name}');`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
            db.release();
        });
    })
}

const deleteLecturesFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM lectures;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
            db.release();
        });
    })
}

const deleteTeachersFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM users;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
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
                }
                resolve(true);
            });
            db.release();
        });
    })
}

const deleteClassesFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM classes;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
            db.release();
        });
    })
}

module.exports = {
    saveCourseToDB,
    saveLectureToDB,
    saveTeacherToDB,
    deleteCoursesFromDB,
    deleteLecturesFromDB,
    deleteTeachersFromDB,
    saveClassToDB,
    deleteClassesFromDB,
}
