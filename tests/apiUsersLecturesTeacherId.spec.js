const server = require("../app");
const supertest = require("supertest");
const {formatDate} = require("./helperMethods");
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

    test("should get a single lecture for a given teacher", async () => {
        const dateTime = formatDate(new Date());
        await saveCourseToDB(1, 'Development of Large Systems');
        const teacherId = await saveTeacherToDB();
        await saveClassToDB(1, 'SD22w');
        const lecture = await saveLectureToDB(teacherId, dateTime, 1, 1);
        await supertest(server).get(`/api/users/lectures/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body[0].lecture_id).toEqual(lecture.lecture_id);
                const localDate = new Date(response.body[0].start_date_time);
                expect(formatDate(localDate)).toEqual(dateTime);
                expect(response.body[0].name).toEqual('Development of Large Systems');
            }).catch(async (error) => {
                console.log(error)
            });
    }, 20000);
});

// multiple lectures for the same class - course combination
// test teacher id if it's string or null,
// if array is empty
