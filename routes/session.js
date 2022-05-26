const router = require('express').Router();

router.get('/getsession', (req, res) => {
  if (
    req.session.userId &&
    req.session.lastName &&
    req.session.firstName &&
    req.session.role &&
    req.session.email
  ) {
    res.send({
      userId: req.session.userId,
      firstName: req.session.firstName,
      lastName: req.session.lastName,
      role: req.session.role,
      email: req.session.email
    });
  } else {
    res.send({
      message: 'User not logged in.'
    });
  }
});

/*
router.post('/setsession', (req, res) => {
  if (req.body.userId && req.body.username && req.body.role) {
    req.session.userId = req.body.userId;
    req.session.username = req.body.username;
    req.session.role = req.body.role;
    req.session.email = result[0].email;
    res.send({ userId: req.body.userId, username: req.body.username, role: req.body.role, message: 'Session is set' });
  } else {
    res.send({ message: 'Session not set' });
  }
});
*/

router.delete('/destroysession', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.send({
        message: 'Something went wrong',
        isDestroyed: 0
      });
    } else {
      res.send({
        message: 'Session destroyed',
        isDestroyed: 1
      });
    }
  });
});

module.exports = {
  router,
};
