var Index = require('../models/index');
var Trips = require('../models/trip');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      var user = req.session.passport.user;
      Index.findOrCreate(user, function(error, result, next) {
        if (error) {
            next(error);
        } else {
          var loggedIn = req.session.passport ? true : false;
          res.render('index', {
            title: "Travel Helper",
            loggedIn: loggedIn,  // This is for the sign in/logout feature
            username: result.name,
            image: result.image_url
          })
        }
      })
    } else {
      var loggedIn = req.session.passport ? true : false;
      res.render('index', {
        title: "Travel Helper",
        loggedIn: loggedIn  // This is for the sign in/logout feature
      })
    }
  },

  getLogout: function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },

  isLoggedIn: function(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log('success');
      next();
    } else {
      res.redirect('/');
    }
  },

  newTrips: function(req, res) {
    res.status(200).json({whatevs: 'whatevs!!!'})
  },

  getTrips: function(req, res) {
    res.status(200).json({yaya: 'yaya!!!'})
  }
}
  module.exports = IndexController;
