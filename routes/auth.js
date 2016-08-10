var express = require('express');
var router = express.Router();
var passport = require('passport'); // For google oauth

router.get('/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    scope: ['profile']
}));


router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/',
    scope: ['profile']
}));

module.exports = router;
