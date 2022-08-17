const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {isLoggedOut, isLoggedIn} = require('../middleware/route-guard')

//SIGNUP

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup');
});

router.get('/profile', isLoggedIn, (req, res) => {
    const { username } = req.session.currentUser;
    res.render('auth/profile', {username});
});

router.get('/main', isLoggedIn, (req, res) => {
  const { username } = req.session.currentUser;
  res.render('auth/main', {username});
});

router.get('/private', isLoggedIn, (req, res) => {
  const { username } = req.session.currentUser;
  res.render('auth/private', {username});
});

router.post('/signup', isLoggedOut, (req, res) => {
  const { username, password } = req.body;
  // console.log('req.body', req.body);

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      //console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //console.log('Newly created user is: ', userFromDB);
      req.session.user = userFromDB;
      //res.render('auth/profile', userFromDB)
      res.redirect('/auth/profile');
      //res.redirect('/auth/login');
    })
    .catch((error) => console.log(error));
});

//LOGIN

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login');
});

router.post('/login', isLoggedOut, (req, res) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

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

router.post('/logout', isLoggedIn, (req, res) => {
  res.clearCookie('connect.sid')
  req.session.destroy(() => res.redirect('/auth/login'))
})

module.exports = router;
