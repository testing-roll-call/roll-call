const router = require('express').Router();
const { pool } = require('../database/connection');
const bcrypt = require("bcrypt");
const { User } = require('../models/User');

router.post('/api/users/register', (req, res) => {
    if (!req.body.userRole || (req.body.userRole !== 'TEACHER' && ratingType !== 'STUDENT')) {
        res.send({
            message: 'Please choose the role: TEACHER or STUDENT.',
        });
        return;
    }
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        if (!error) {
            pool.getConnection((err, db) => {
                let query = 'INSERT INTO users (user_role, email, password) VALUES (?, ?, ?)';
                db.query(query, [req.body.userRole, req.body.email, hash], (error, result, fields) => {
                    if (result && result.affectedRows === 1) {
                        res.send({
                            message: 'User successfully added.',
                        });
                    } else {
                        res.send({
                            message: 'Something went wrong',
                        });
                    }
                });
                db.release();
            });
        } else {
            res.status(500).send({
                message: "Something went wrong. Try again."
            });
        }
    });
});

router.post('/api/users/login', (req, res) => {
    pool.getConnection((err, db) => {
        let query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [req.body.email], (error, result, fields) => {
            if (result && result.length) {
                bcrypt.compare(req.body.password, result[0].password, (error, match) => {
                    if (match) {
                        res.send({
                            message: 'User logged in.',
                        });
                    } else {
                        res.status(401).send({
                            message: "Incorrect username or password. Try again."
                        });
                    }
                });
            } else {
                res.send({
                    message: 'Something went wrong',
                });
            }
        });
        db.release();
    });
});

module.exports = {
    router,
  };