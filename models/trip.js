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
  // console.log("This is params: ", params);
  var name = params.name;
  var address = params.address;
  var website = params.website;
  var latitude = params.latitude;
  var longitude = params.longitude;
  var phone = params.phone;
  var photo_url = params.photo_url;

  var tagID = params.tagID;
  db.activity.insert({name: name, address: address, website: website, latitude: latitude, longitude: longitude, phone: phone, photo_url: photo_url}, function(error, activity) {
    if (error || !activity) {
      console.log("error updating activity error");
      callback(error || new Error("Could not save activity"), undefined);
    } else {
      db.tag.update({id: tagID, modified_date: new Date()}, function(error, tag) {
        if (error) {
          callback(error, undefined);
        } else {
          db.activity_tag.save({activity_id: activity.id, tag_id: tagID}, function(error, item) {
            if (error) {
              callback(error, undefined)
            } else {
              console.log("all tables updated in new activity");
            }
          })
        }
      })
      callback(null, activity);
    }
  });
}

Trip.deleteActivityFromDatabase = function(activityID, callback) {
  db.activity.destroy({id: activityID}, function(error, result) {
    if (error || !result) {
      console.log("Error deleting activity");
      callback(error || new Error("Could not delete activity"), undefined);
    } else {
      db.activity_tag.destroy({activity_id: activityID}, function(err, res) {
        if (err || !res) {
          console.log("error deleting activity_tag");
          callback(error || new Error("Could not delete activity_tag"), undefined);
        } else {
          console.log("all tables updated while deleting activity");
        }
      })
      callback(null, result);
    }
  });
}


module.exports = Trip;
