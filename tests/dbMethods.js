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
                    console.log('error inserting courses...')
                    reject(error);
                } else {
                    resolve(true);
                }
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
                } else {
                    resolve(true);
                }
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

module.exports = {
    saveCoursesToDB,
    saveLectureToDB,
    saveTeacherToDB,
    deleteCoursesFromDB,
    deleteLecturesFromDB,
    deleteTeachersFromDB,
}
