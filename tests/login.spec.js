const express = require('express');

const request = require('supertest'); // test web apis

const { testPool } = require('../database/connection');



const app = express(); // fake express app

app.use('/api', require('../routes/router'));



describe('server-routes', () => {



  test('GET /api/cpr-name-gender - success', async () => {

    const { body } = await request(app).get('/api/users/students/:classId'); // use the request function that we can use the app// save the response

    expect(Object.keys(body).sort()).toEqual(['cpr', 'gender', 'name', 'surname']); // test all necessary keys

    expect(body.gender).toEqual(Number(body.cpr) % 2 === 0 ? 'female' : 'male');// test match gender and cpr

  });



 

  afterAll(() => { pool.end(); });

});