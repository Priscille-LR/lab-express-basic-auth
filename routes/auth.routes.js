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
    res.render('auth/profile');
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
      })
    })
    .then((userFromDB) => {
      //console.log('Newly created user is: ', userFromDB);
      //req.session.currentUser = userFromDB
      console.log('user from DB', userFromDB)
      res.render('auth/profile', userFromDB);
    //   res.redirect('/auth/profile', userFromDB);
    })
    .catch((error) => console.log(error));
});



//LOGIN

module.exports = router;
