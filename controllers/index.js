var Index = require('../models/index');
var Trips = require('../models/trip');
var Activity = require('../models/activity');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      var user = req.session.passport.user;
      Index.findOrCreate(user, function(error, result, next) {
        if (error) {
          next(error);
        } else {
          var loggedIn = req.session.passport ? true : false;
          req.session.username = result.name;
          req.session.image_url = result.image_url;
          res.render('index', {
            title: "Mapify",
            loggedIn: loggedIn,  // This is for the sign in/logout feature
            username: result.name,
            image: result.image_url
          })
        }
      })
    } else {
      var loggedIn = req.session.passport ? true : false;
      res.render('index', {
        title: "Mapify",
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
    var google_id = req.session.passport.user.id;
    var loggedIn = req.session.passport ? true : false;
    var username = req.session.username;
    var image_url = req.session.image_url;

    Trips.find_all(google_id, function(error, result) {
      if (error) {
        new Error(error);
      } else {
        res.render('trips', {
          title: "Travel Helper",
          trips: result,
          loggedIn: loggedIn,
          username: username,
          image: image_url
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
    var username = req.session.username;
    var image_url = req.session.image_url;

    Trips.findOneTrip(tripID, function(error, trip) {
      if(error) {
        var err = new Error("Could not find trip:\n" + error.message);
        err.status = 500;
      } else {
        res.render('maptrip', {
          title: "Travel Helper",
          trip: trip,
          loggedIn: loggedIn,
          tagID: tripID,
          username: username,
          image: image_url
        })
      };
    });
  },

  addActivity: function(req, res) { // update schema, use above function, update model to handle all things
    var activityStuff = req.body;
    var tagID = req.body.tagID;
    Activity.addNewActivity(activityStuff, function(error, activity) {
      if (error) {
        var err = new Error("Error creating trip:\n" + error.message);
        err.status = 500;
      }
      res.json(activity);
    });
  },

  findAllActivitiesByTag: function(req, res) {
    var activities = {};
    var tagID = req.query.tagID;
    Activity.activity_by_tag(tagID, function(error, activities) {
      if (error || !activities) {
        callback(error, undefined)
      } else {
        res.json(activities);
      }
    });
  },

  deleteActivity: function(req, res) {
    var activity_google_id = req.body.google_id;
    var tagID = req.params.id;
    Trips.deleteActivityFromDatabase(activity_google_id, tagID, function(error, item) {
      if (error) {
        var errors = new Error("Error deleting activity:\n" + error.message);
        errors.status = 500;
      } else {
        Activity.activity_by_tag(tagID, function(err, activities) {
          if (err) {
            console.log("Error in deleteActivity: ", err);
            callback(err, undefined)
          } else {
            res.json(activities);
          }
        })
      }
    })
  },

  completeActivity: function(req, res) {
    var tagID = req.body.tagID;
    var google_id = req.body.google_id;
    Activity.completedActivityUpdateDatabase(tagID, google_id, function(error, result) {
      if (error || !result) {
        var err = new Error("Error updating activity_tag:\n" + error.message);
        err.status = 500
      } else {
        res.json(result)
      }
    });
  }
}

module.exports = IndexController;
