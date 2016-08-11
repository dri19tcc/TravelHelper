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
    var loggedIn = req.session.passport ? true : false;
    var google_id = req.session.passport.user.id;
    Trips.find_all(google_id, function(error, result, next) {
      if (error) {
        new Error(error);
      } else {
        res.render('trips', {
          title: "Travel Helper",
          trips: result,
          loggedIn: loggedIn
        })
      }
    });
  },

  createTrip: function(req, res, next) {
    console.log(req.body)
    Trips.new([req.body], function(error, trip) {
      if(error) {
      var err = new Error("Error creating movie:\n" + error.message);
      err.status = 500;
      next(err);
      } else {
        console.log(item)
        res.redirect('http://localhost:3000/movies/'+item.id);
      }
    })
  },

  getTrips: function(req, res) {
    console.log("This is req in new trips", req);

    res.render('mytrip', {
      title: "Travel Helper",
    })
  }
}
  module.exports = IndexController;
