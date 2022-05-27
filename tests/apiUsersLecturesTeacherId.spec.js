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
    }, 20000);

    afterAll(() => {
        pool.end();
    });

    test("should get a single lecture for a teacher", async () => {
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

    test("should get multiple lectures for a teacher", async () => {
        const now = new Date();
        const after2hours = new Date();
        after2hours.setHours(after2hours.getHours() + 2);
        const nowFormatted = formatDate(now);
        const after2hoursFormatted = formatDate(after2hours);
        await saveCourseToDB(1, 'Development of Large Systems');
        await saveCourseToDB(2, 'Testing');
        const teacherId = await saveTeacherToDB();
        await saveClassToDB(1, 'SD22w');
        await saveClassToDB(2, 'SD23w');
        const lecture1 = await saveLectureToDB(teacherId, nowFormatted, 1, 1);
        const lecture2 = await saveLectureToDB(teacherId, after2hoursFormatted, 2, 2);
        await supertest(server).get(`/api/users/lectures/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body[0].lecture_id).toEqual(lecture1.lecture_id);
                const localDate1 = new Date(response.body[0].start_date_time); // we get time from server in UTC, new Date() converts it to local time
                expect(formatDate(localDate1)).toEqual(nowFormatted);
                expect(response.body[0].name).toEqual('Development of Large Systems');

                expect(response.body[1].lecture_id).toEqual(lecture2.lecture_id);
                const localDate2 = new Date(response.body[1].start_date_time);
                expect(formatDate(localDate2)).toEqual(after2hoursFormatted);
                expect(response.body[1].name).toEqual('Testing');
            }).catch(async (error) => {
                console.log(error)
            });
    }, 20000);

    test("should get empty array if the date is other than today", async () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowFormatted = formatDate(tomorrow);
        await saveCourseToDB(1, 'Development of Large Systems');
        const teacherId = await saveTeacherToDB();
        await saveClassToDB(1, 'SD22w');
        await saveLectureToDB(teacherId, tomorrowFormatted, 1, 1);
        await supertest(server).get(`/api/users/lectures/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeFalsy();
                expect(response.body.message).toEqual('Something went wrong');
            }).catch(async (error) => {
                console.log(error)
            });
    }, 20000);
});
