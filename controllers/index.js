var Index = require('../models/index');
var Trips = require('../models/trip');
var Activity = require('../models/activity')

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
    Trips.find_all(google_id, function(error, result) {
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
    var tripName = req.body;
    var user = req.user.id;
    Trips.new([tripName, user], function(error, trip) {
      if(error) {
        var err = new Error("Error creating trip:\n" + error.message);
        err.status = 500;
        next(err);
      } else {
        res.redirect('/trips/' + trip.id);
      }
    });
  },

  showTrip: function(req, res) { //database call, look up current trip, and the map and all the points
    var tripID = req.params.id;
    var loggedIn = req.session.passport ? true : false;

    Trips.findOneTrip(tripID, function(error, trip) {
      if(error) {
        var err = new Error("Could not find trip:\n" + error.message);
        err.status = 500;
      } else {
        Activity.activity_by_tag(tripID, function(error, activities) {
          res.render('maptrip', {
            title: "Travel Helper",
            trip: trip,
            loggedIn: loggedIn,
            activities: activities
          })
        });
      };
    });

  },

  addActivity: function(req, res) { // update schema, use above function, update model to handle all things
    var activityStuff = req.body;
    var tagID = req.body.tagID;
    Trips.newActivity(activityStuff, function(error, activity) {
      if (error) {
        var err = new Error("Error creating trip:\n" + error.message);
        err.status = 500;
      } else {
        Activity.activity_by_tag(tagID, function(error, activities) {
          // do some error handling here!
          //map activities so they show up
          res.json(activities);
        });
      }
    });
  },

  findAllActivitiesByTag: function(req, res) {
    var activities = {};
    var tagID = req.query.tagID;
    Activity.activity_by_tag(tagID, function(error, activities) {
      res.json(activities);
    });
  },

  deleteActivity: function(req, res, next) {
    var activityID = req.body.id;
    var tagID = req.params.id;
    Trips.deleteActivityFromDatabase(activityID, function(error, item) {
      if(error) {
        var err = new Error("Error deleting movie:\n" + error.message);
        err.status = 500;
        next(err);
      } else {
        Activity.activity_by_tag(tagID, function(error, activities) {
          // do some error handling here!
          //map activities so they show up
          // console.log(activities);
          res.json(activities);
        })
      }
    })
  }
}

module.exports = IndexController;
