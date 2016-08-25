var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');


var passport = require('passport'); // For google oauth
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var massive = require('massive');
var http = require('http');

var app = module.exports = express();

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  console.log("starting in production mode, listening on port " + process.env.PORT);
  var connectionString = "postgres://"+process.env.RDS_USERNAME+":"
                                      +process.env.RDS_PASSWORD+"@"
                                      +process.env.RDS_HOSTNAME+":"
                                      +process.env.RDS_PORT+"/"
                                      +process.env.RDS_DB_NAME;

  console.log("RDS connection string: " + connectionString);
  var db = massive.connectSync({connectionString : connectionString});
  app.set("db", db);
  http.createServer(app).listen(process.env.PORT);
} else if (env === 'development') {
  console.log("starting in development mode");
  var dotenv = require('dotenv').config(); // Use to keep keys secret (console.log(process.env);)
  var connectionString = "postgres://localhost:5432/travel_helper";
  var db = massive.connectSync({connectionString : connectionString});
  app.set("db", db);
  http.createServer(app).listen(8080);
}

passport.use(new GoogleStrategy({ // authentication strategy authenticates users using a Google account and OAuth 2.0 tokens
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://mapify.us-west-2.elasticbeanstalk.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(session({
  secret: process.env.TOPSECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

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

var authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// var tripsRoutes = require('./routes/trips');
// app.use('/trips', tripsRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler, and will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, and no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
