var app = require('../app');
var db = app.get('db');
var Activity = require('./activity')

var Trip = function(trip) {
  this.tripID = trip.tag_id,
  this.tripName = trip.name,
  this.tripUpdate = trip.modified_date,
  this.activities = trip.activity
};


Trip.find_all = function(googleID, callback) { // left join instead of inner join?
  db.find_all_tags([googleID], function(error, trips) {
    if (error) {
      callback(error, undefined);
    } else {
      callback(null, trips.map(function(trip) {
        return new Trip(trip)
      }));
    };
  });
};

Trip.new = function(params, callback) {
  var name = params[0].name;
  var google_id = params[1]; // this gives the google_id
  db.tag.insert({name: name, modified_date: new Date()},function(error, item) {
    if(error || !item) {
      callback(error || new Error("Could not retrieve tag"), undefined);
    } else {
      db.users.findOne({google_id: google_id}, function(error, user) {
        if (error) {
          callback(error, undefined);
        } else {
          db.user_tag.save({user_id: user.id, tag_id: item.id}, function(err, res) {
            if (error) {
              callback(error, undefined);
            } else {
              // console.log("table updated");
            };
          })
        };
      });
      callback(null, item);
    };
  });
};

Trip.findOneTrip = function(tripID, callback) { // break out into another method that calls all activities
  db.tag.findOne({id: tripID}, function(error, trip) {
    if (error) {
      callback(error, undefined);
    } else {
      Activity.activity_by_tag(tripID, function(error, activities) {
        if (error) {
          callback(error, undefined);
        } else {
          trip.activities = activities;
          callback(null, trip); // need a wrapper object that returns trip and activities
        }
      })
    };
  });
};

Trip.newActivity = function(params, callback) {
  var activityHash = {
    name: params.name,
    address: params.address,
    website: params.website,
    latitude: params.latitude,
    longitude: params.longitude,
    phone: params.phone,
    photo_url: params.photo_url,
    google_id: params.google_id
  };

  var tagID = params.tagID;
  db.activity.insert(activityHash, function(error, activity) {
    if (error || !activity) {
      console.log("error updating activity error");
      callback(error || new Error("Could not save activity"), undefined);
    } else {
      db.tag.update({id: tagID, modified_date: new Date()}, function(error, tag) {
        if (error) {
          callback(error, undefined);
        } else {
          db.activity_tag.save({activity_google_id: activity.google_id, tag_id: tagID}, function(error, item) {
            if (error) {
              callback(error, undefined)
            } else {
              console.log("all tables updated in new activity");
            }
          });
        }
      });
      callback(null, activity);
    }
  });
}

Trip.deleteActivityFromDatabase = function(activityID, callback) {
  db.activity_tag.destroy({activity_id: activityID}, function(err, res) {
    if (err || !res) {
      console.log("error deleting activity_tag");
      callback(error || new Error("Could not delete activity_tag"), undefined);
    } else {
      console.log("all tables updated while deleting activity");
      callback(null, res);
    }
  });
}


module.exports = Trip;
