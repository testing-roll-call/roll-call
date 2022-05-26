const server = require("../app");
const supertest = require("supertest");
const {getDateTime} = require("./helperMethods");
const {pool} = require("../database/connection");
const {
    saveTeacherToDB,
    saveLectureToDB,
    saveCourseToDB,
    deleteTeachersFromDB,
    deleteLecturesFromDB,
    deleteCoursesFromDB,
    saveClassToDB,
    deleteClassesFromDB,
} = require("./dbMethods");

describe('GET /api/users/lectures/:teacherId', () => {

    afterEach(async () => {
        await deleteLecturesFromDB();
        await deleteTeachersFromDB();
        await deleteCoursesFromDB();
        await deleteClassesFromDB();
    });

    afterAll(() => {
        pool.end();
    });

    // test("should get correct statistics", async () => {
    //     const dateTime = getDateTime();
    //     await saveCoursesToDB();
    //     await saveClassesToDB();
    //     const teacherId = await saveTeacherToDB();
    //     const lecture = await saveLectureToDB(teacherId, dateTime);
    //     await supertest(server).get(`/api/users/lectures/${teacherId}`)
    //         .expect(200)
    //         .then((response) => {
    //             expect(Array.isArray(response.body)).toBeTruthy();
    //             expect(response.body.lecture_id).toEqual(lecture.lecture_id);
    //             expect(response.body.start_date_time).toEqual(dateTime);
    //             expect(response.body.name).toEqual('Development of Large Systems');
    //         }).catch(async (error) => {
    //             console.log(error)
    //         });
    // }, 20000);
});

// multiple lectures for the same class - course combination
// test teacher id if it's string or null,
// if array is empty
