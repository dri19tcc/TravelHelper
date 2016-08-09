var express = require('express');
var router = express.Router();
var passport = require('passport'); // For google oauth

router.get('/google_oauth2',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/google_oauth2/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }), function(req, res) {
    // Successful authentication, redirect home.
  res.redirect('/');
});

module.exports = router;
