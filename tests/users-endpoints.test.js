const server = require("../app");
const supertest = require("supertest");

test("GET /api/users/lectures/:teacherId", async () => {
    await supertest(server).get("/api/users/lectures/1")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            for (let lecture of response.body) {
                expect(new Date(lecture.start_date_time).getTime()).toBeGreaterThan(Date.now());
            }
        });
});
