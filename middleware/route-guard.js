const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};


// const isLoggedOut = (req, res, next) => {
//   if (!req.session.user) {
//     next();
//   }
//   res.redirect('/');
// };

// const isLoggedIn = (req, res, next) => {
//   if (req.session.user) {
//     next();
//   }
//   res.redirect('/auth/login');
// };

