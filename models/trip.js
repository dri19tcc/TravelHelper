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

Trip.new = function(users, callback) {
  var name = users[0].name;
  var google_id = users[1]; // this gives the google_id
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
            }
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
          console.log("Inside model findOneTrip activity_by_tag", error);
          callback(error, undefined);
        } else {
          trip.activities = activities;
          callback(null, trip); // need a wrapper object that returns trip and activities
        }
      })
    };
  });
};

// Trip.newActivity = function(activity, callback) { //won't be using this anymore so delete
//   var activityHash = {
//     name: activity.name,
//     address: activity.address,
//     website: activity.website,
//     latitude: activity.latitude,
//     longitude: activity.longitude,
//     phone: activity.phone,
//     google_id: activity.google_id
//   };
//   var tagID = activity.tagID;
//
//   db.activity.findOne({google_id: activityHash.google_id}, function (error, result) {
//     if (error) {
//       callback(error, undefined)
//     } else {
//       if (!result) { // find or create by instead of insert
//         db.activity.insert(activityHash, function(error, activity) {
//           if (error || !activity) {
//             console.log("error updating activity error", error);
//             callback(error || new Error("Could not save activity"), undefined);
//           } else {
//             Trip.updateActivityTag(activity.google_id, tagID, callback); // in activity like above
//             Trip.updateTagDate(tagID, callback);
//             // console.log("add activity: ", activity);
//             callback(null, activity);
//           }
//         });
//       } else {
//         Trip.updateActivityTag(result.google_id, tagID, callback);
//         Trip.updateTagDate(tagID, callback);
//         // console.log("add result: ", result);
//         callback(null, result);
//       }
//     }
//   });
// }

Trip.updateTagDate = function(tagID, callback) {
  db.tag.update({id: tagID, modified_date: new Date()}, function(error, tag) {
    if (error) {
      callback(error, undefined);
    }
  });
}

Trip.updateActivityTag = function(activity_google_id, tagID, callback) {
  db.activity_tag.save({activity_google_id: activity_google_id, tag_id: tagID}, function(error, item) {
    if (error) {
      callback(error, undefined)
    }
  });
}

Trip.deleteActivityFromDatabase = function(activity_google_id, tagID, callback) {
  db.activity_tag.destroy({activity_google_id: activity_google_id, tag_id: tagID}, function(err, res) {
    if (err || !res) {
      console.log("error deleting activity_tag", err);
      callback(err || new Error("Could not delete activity_tag"), undefined);
    } else {
      callback(null, res);
    }
  });
}


module.exports = Trip;
