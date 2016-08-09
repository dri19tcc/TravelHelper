var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv').config(); // Use to keep keys secret (console.log(process.env);)

var passport = require('passport'); // For google oauth
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var massive = require('massive')

// var app = express();
var app = module.exports = express()
// module.exports = app

// authentication strategy authenticates users using a Google account and OAuth 2.0 tokens
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      googleId: profile.id,
      googleName: profile.getName,
      googleImage: profile.getImageUrl,
      googleEmail: profile.getEmail
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

var connectionString = "postgres://localhost/travel_helper"
var db = massive.connectSync({connectionString : connectionString})
app.set("db", db)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

var usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

var authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
