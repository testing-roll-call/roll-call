const server = require("../app");
const supertest = require("supertest");
const {getDateTime} = require("./helperMethods");
const {pool} = require("../database/connection");
const {
    saveTeacherToDB,
    saveLectureToDB,
    saveCoursesToDB,
    deleteTeachersFromDB,
    deleteLecturesFromDB,
    deleteCoursesFromDB
} = require("./dbMethods");

describe('GET /api/users/lectures/:teacherId', () => {

    test("should get correct statistics", async () => {
        const dateTime = getDateTime();
        await saveCoursesToDB();
        const teacherId = await saveTeacherToDB();
        const lecture = await saveLectureToDB(teacherId, dateTime);
        await supertest(server).get(`/api/users/lectures/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.lecture_id).toEqual(lecture.lecture_id);
                expect(response.body.start_date_time).toEqual(dateTime);
                expect(response.body.name).toEqual('Development of Large Systems');
            }).catch(async (error) => {
                console.log(error)
            });
        await deleteLecturesFromDB(teacherId);
        await deleteTeachersFromDB(teacherId);
        await deleteCoursesFromDB();
    }, 20000);

    afterAll(() => {
        pool.end();
    });

});

// multiple lectures for the same class - course combination
// test teacher id if it's string or null,
// if array is empty
