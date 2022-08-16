const express = require('express');
const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

//SIGNUP

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/profile', (req, res) => {
  const { username } = req.session.currentUser;
  res.render('auth/profile', { username });
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log('req.body', req.body);

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //console.log('Newly created user is: ', userFromDB);
      req.session.currentUser = userFromDB;
      //   console.log('user from DB', userFromDB)
      res.redirect('/auth/profile');
    })
    .catch((error) => console.log(error));
});

//LOGIN

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.',
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/auth/profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
