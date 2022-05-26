const server = require("../app");
const supertest = require("supertest");

const {pool} = require('../database/connection');
describe('login test', () => {

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

    loginPass.forEach(({ args }) => {
        test("POST /api/users/login", async () => {
            await insertInitialData();
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
                }).catch( (e) => {
                    throw e.stack;
                });
                await deleteUserFromDB();
        }, 20000);
    });

    loginFail.forEach(({ args, expected }) => {
        test("POST /api/users/login", async () => {
            await insertInitialData();
            await supertest(server).post(`/api/users/login`)
                .send({args})
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeTruthy();
                    expect(response.body.message).toEqual(expected);
                }).catch( (e) => {
                    throw e.stack;
                });
                await deleteUserFromDB();
        }, 20000);
    });

    afterAll(()=> {
        pool.end();
    });

});

function deleteUserFromDB () {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
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

function insertInitialData (){
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO users (user_id, first_name, last_name, email, user_role, password, class_id) VALUES (1, "Kane", "Vasquez", "v-kane@yahoo.com", "TEACHER", "$2b$15$PGfdEXxNY2M.OSsh1mjIFuy9Tg32Z3Cc5QkKPGIW5f.DNVXpGYwOa", NULL);`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            db.release();
        });
    })
}