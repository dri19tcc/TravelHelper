var express = require('express');
var router = express.Router();
var passport = require('passport'); // For google oauth

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth'
  }), function(req, res) {
    // Successful authentication, redirect home.
  res.redirect('/auth');
});

module.exports = router;
