const server = require("../app");
const supertest = require("supertest");

const {pool, testPool} = require('../database/connection');

describe('register test', () => {

    const userArrayPass = [
        {args: {
            firstName: "Dagmara",
            lastName: "Przygocka",
            user_role: "TEACHER",
            email: "v-kane@yahoo.com",
            password: "JmE95osSMM4bYF", 
            class_id: null,
        }, expected: "Something went wrong. Try again."},
        {args: {
            firstName: "Marianna",
            lastName: "Smith",
            user_role: "STUDENT",
            email: " v-m@yahoo.com",
            password: "JmE95osSMM4bYK", 
            class_id: 1,
        }, expected: "Something went wrong. Try again."}
    ];
    const userArrayFail = [
        {args: {
            firstName: "FailName",
            lastName: "FailSurname",
            user_role: "FAIL",
            email: "ff@yahoo.com",
            password: "KmE95osSMM4bYK", 
            class_id: 1,
        }, expected: "Please choose the role: TEACHER or STUDENT."},
        {args: {
            firstName: "FailName",
            lastName: "FailSurname",
            user_role: "STUDENT",
            email: 5,
            password: "KmE95osSMM4bYK", 
            class_id: 1,
        }, expected: "Something went wrong. Try again."},
        {args: {
            firstName: "FailName",
            lastName: null,
            user_role: "STUDENT",
            email: "ff@yahoo.com",
            password: "KmE95osSMM4bYK", 
            class_id: 1,
        }, expected: "Something went wrong. Try again."},
        {args: {
            firstName: null,
            lastName: "FailSurname",
            user_role: "STUDENT",
            email: "ff@yahoo.com",
            password: "KmE95osSMM4bYK", 
            class_id: 1,
        }, expected: "Something went wrong. Try again."},
        {args: {
            firstName: "Marianna",
            lastName: "Smith",
            user_role: "STUDENT",
            email: " v-m@yahoo.com",
            password: "JmE95osSMM4bYKKKKKKKKKKKKKKKKKKKKKKKKKKKKJJJJJJJJJJJJJJJJJJJJJJJJJJJJOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", 
            class_id: 1,
        }, expected: "Something went wrong. Try again."}
    ];

    const loginPass = [
        {args: {
            email: "v-kane@yahoo.com",
            password: "JmE95osSMM4bYF"
        }}
    ]

    const loginFail = [
        {args: {
            email: "fake-kane@yahoo.com",
            password: "JmE95osSMM4bYF"
        }, expected: "Incorrect username or password. Try again."
        },
        {args: {
            email: "v-kane@yahoo.com",
            password: "JmE95osSMM4bYG"
        }, expected: "Incorrect username or password. Try again."
        },
    ]

    userArrayPass.forEach(({ args, expected }) => {
        test("POST /api/users/register", async () => {
            await supertest(server).post(`/api/users/register`)
                .send({args})
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeTruthy();
                    expect(response.body.message).toEqual(expected);
                }).catch(async () => {
                    console.log('error');
                })
        }, 20000);
    });

    userArrayFail.forEach(({ args, expected }) => {
        test("POST /api/users/register", async () => {
            await supertest(server).post(`/api/users/register`)
                .send({args})
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeTruthy();
                    expect(response.body.message).toEqual(expected);
                }).catch(async () => {
                    console.log('error');
                });
        }, 20000);
    });

    loginPass.forEach(({ args }) => {
        test("POST /api/users/login", async () => {
            await supertest(server).post(`/api/users/login`)
                .send({args})
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeTruthy();
                    expect(typeof response.body.userId).toBe('number');
                    expect(response.body.role).toEqual("TEACHER");
                    expect(response.body.role).toEqual("TEACHER");
                    expect(response.body.email).toEqual("v-kane@yahoo.com");
                    expect(response.body.firstName).toEqual("Dagmara");
                    expect(response.body.firstName).toEqual("Przygocka");
                }).catch(async () => {
                    console.log('error');
                })
        }, 20000);
    });

    loginFail.forEach(({ args, expected }) => {
        test("POST /api/users/login", async () => {
            await supertest(server).post(`/api/users/login`)
                .send({args})
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeTruthy();
                    expect(response.body.message).toEqual(expected);
                }).catch(async () => {
                    console.log('error');
                }).finally(async () => {
                    await deleteUserFromDB();
                });
        }, 20000);
    });

    afterAll(async () => {
        await deleteUserFromDB();
        testPool.end();
        pool.end();
      });

});

function deleteUserFromDB () {
    return new Promise((resolve, reject) => {
        testPool.getConnection((err, db) => {
            let query =
                'DELETE FROM users where user_id >0;';
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve("Data deleted");
            });
            db.release();
        });
    })
}