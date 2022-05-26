const server = require("../app");
const supertest = require("supertest");

const {pool} = require('../database/connection');
describe('teacherStatistics test', () => {

    test("POST /api/users/teachers/attendance/:teacherId correct", async () => {
        await insertInitialData();
        const class_id = 1;
        const course_id = 1;
        const teacherId = 1;
        await supertest(server).post(`/api/users/teachers/attendance/${teacherId}`)
            .send({data: {class_id, course_id}})    
            .expect(200)
            .then((response) => {
                //console.log(response);
                expect((response.body)).toBeTruthy();
                expect(response.body.classAttendance).toEqual("50.00");
                expect(response.body.monthlyAttendance).toEqual("0.00");
                expect(response.body.weeklyAttendance).toEqual("0.00");
                expect(response.body.studentsAttendance['bodom9915@yahoo.net'].firstName).toEqual('Brenden');
                expect(response.body.studentsAttendance['bodom9915@yahoo.net'].lastName).toEqual('Odom');
                expect(response.body.studentsAttendance['bodom9915@yahoo.net'].attendance).toEqual("50.00");
                expect(response.body.studentsAttendance['m-mckay5458@yahoo.net'].firstName).toEqual('Mira');
                expect(response.body.studentsAttendance['m-mckay5458@yahoo.net'].lastName).toEqual('Mckay');
                expect(response.body.studentsAttendance['m-mckay5458@yahoo.net'].attendance).toEqual("50.00");
            }).catch( (e) => {
                throw e.stack;
            });
            await deleteData();
    }, 20000);

    const testsFail = [
        { args: {
                teacherId: 0,
                class_id: 1,
                course_id: 1,
            }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: 0,
            course_id: 1,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: 1,
            course_id: 0,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 'string',
            class_id: 1,
            course_id: 1,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: 'string',
            course_id: 1,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: 1,
            course_id: 'string',
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: null,
            class_id: 1,
            course_id: 1,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: null,
            course_id: 1,
        }, expected: 'Something went wrong' },
        { args: {
            teacherId: 1,
            class_id: 1,
            course_id: null,
        }, expected: 'Something went wrong' },
    ];
    testsFail.forEach(({ args, expected }) => {
        test(`POST /api/users/teachers/attendance/:teacherId fail with args ${args} expect ${expected}`, async () => {
            await insertInitialData();
            await supertest(server).post(`/api/users/teachers/attendance/${args.teacherId}`)
                .send({data: {class_id: args.class_id, course_id: args.course_id}})  
                .expect(200)
                .then((response) => {
                    expect((response.body)).toBeTruthy();
                    expect(response.body.message).toEqual(expected);
                }).catch( (e) => {
                    throw e.stack;
                });
                await deleteData();
        }, 20000);
    });

    afterAll(()=> {
        pool.end();
    });
});

function insertInitialData (){
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO classes (class_id, name) VALUES (1, 'SD22w');`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    let query = `INSERT INTO users (user_id, first_name, last_name, email, user_role, password, class_id) VALUES (1, "Kane", "Vasquez", "v-kane@yahoo.com", "TEACHER", "$2b$15$PGfdEXxNY2M.OSsh1mjIFuy9Tg32Z3Cc5QkKPGIW5f.DNVXpGYwOa", NULL),
                            (7, "Brenden", "Odom", "bodom9915@yahoo.net", "STUDENT", "$2b$15$1CvVo/487ouwkSFjDixa1uJTPJ/S5zzPlLgGZYeoJ19I8L0jiRSHe", 1),
                            (8, "Mira", "Mckay", "m-mckay5458@yahoo.net", "STUDENT", "$2b$15$fEaiqLCLPiiY13xA9tx6xeWiWuK7ozZ0rgqyIz4iX1y.1gBZOasLK", 1);`;
                        db.query(query, (error, result, fields) => {
                        if (error) {
                            reject(error);
                        } else {
                            let query = `INSERT INTO courses (course_id, name) VALUES (1, 'Development of Large Systems');`;
                            db.query(query, (error, result, fields) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    let query = `INSERT INTO lectures (lecture_id, course_id, teacher_id, start_date_time, class_id) VALUES
                                        (1, 1, 1, "2022-03-03 8:30:00", 1),
                                        (2, 1, 1, "2022-03-03 9:15:00", 1),      
                                        (3, 1, 1, "2022-03-03 10:00:00", 1),      
                                        (4, 1, 1, "2022-03-03 10:45:00", 1);`;
                                    db.query(query, (error, result, fields) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            let query = ` INSERT INTO attendance (user_id, lecture_id, is_attending) VALUES
                                                (7, 1, 1), (7, 2, 1), (7, 3, 0), (7, 4, 0),
                                                (8, 1, 0), (8, 2, 0), (8, 3, 1), (8, 4, 1);`;
                                            db.query(query, (error, result, fields) => {
                                                if (error) {
                                                    reject(error);
                                                } else {
                                                    resolve(result);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            db.release();
        });
    })
}

function deleteData (){
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM attendance WHERE attendance_id > 0;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    let query = `DELETE FROM lectures WHERE lecture_id > 0;`;
                    db.query(query, (error, result, fields) => {
                        if (error) {
                            reject(error);
                        } else {
                            let query = `DELETE FROM courses WHERE course_id > 0;`;
                            db.query(query, (error, result, fields) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    let query = `DELETE FROM users WHERE user_id > 0;`;
                                    db.query(query, (error, result, fields) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            let query = `DELETE FROM classes WHERE class_id > 0;`;
                                            db.query(query, (error, result, fields) => {
                                                if (error) {
                                                    reject(error);
                                                } else {
                                                    resolve(result);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            db.release();
        });
    })
}