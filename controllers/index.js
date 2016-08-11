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
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  },




  newTrips: function(req, res) {
    // console.log("This is req in new trips", req);
    var loggedIn = req.session.passport ? true : false;
    var google_id = req.session.passport.user.id;
    Trips.find_all(google_id, function(error, result, next) {
      if (error) {
        new Error(error);
      } else {
        console.log("THIS IS THE RESULT: ", result);
        res.render('trips', {
          title: "Travel Helper",
          trips: result,
          loggedIn: loggedIn
        })
      }
    });
  },









  getTrips: function(req, res) {
    console.log("This is req in new trips", req);

    var loggedIn = req.session.passport ? true : false;

    res.render('mytrip', {
      title: "Travel Helper",
      loggedIn: loggedIn  // This is for the sign in/logout feature
    })
  }
}
  module.exports = IndexController;
