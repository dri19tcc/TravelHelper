var Activity = function(activity) {
  this.name = activity.name,
  this.address = activity.address,
  this.website = activity.website,
  this.longitude = activity.longitude,
  this.latitude = activity.latitude,
  this.phone = activity.phone,
  this.google_id = activity.google_id,
  this.completed = activity.completed
}

module.exports = Activity;

var app = require('../main');
var db = app.get('db');
var Trip = require('./trip');

Activity.activity_by_tag = function(tagID, callback) {
  db.find_activities([tagID], function(error, activities) {
    if (error) {
      callback(error, undefined);
    } else {
      callback(null, activities.map(function(activity) {
        return new Activity(activity);
      }));
    }
  });
}

Activity.completedActivityUpdateDatabase = function(tagID, google_id, callback) {
  db.activity_tag.findOne({tag_id: tagID, activity_google_id: google_id}, function(error, activity) {
    if (error) {
      callback(error, undefined);
    } else {
      db.activity_tag.update({id: activity.id, completed: !activity.completed}, function(err, res) {
        if (err) {
          callback(err, undefined);
        } else {
          callback(null, res);
        }
      });
    }
  });
}

Activity.addNewActivity = function(activity, callback) {
  var tagID = activity.tagID;
  var activityHash = {
    name: activity.name,
    address: activity.address,
    website: activity.website,
    latitude: activity.latitude,
    longitude: activity.longitude,
    phone: activity.phone,
    google_id: activity.google_id
  }

  db.activity.findOne({google_id: activityHash.google_id}, function (error, result) {
    if (error) {
      callback(error, undefined)
    } else {
      if (!result) { // find or create by instead of insert
        db.activity.insert(activityHash, function(error, activity) {
          if (error || !activity) {
            console.log("error updating activity error", error);
            callback(error || new Error("Could not save activity"), undefined);
          } else {
            Trip.updateActivityTag(activity.google_id, tagID, callback); // in activity like above
            Trip.updateTagDate(tagID, callback);
            callback(null, activity);
          }
        });
      } else {
        Trip.updateActivityTag(result.google_id, tagID, callback);
        Trip.updateTagDate(tagID, callback);
        callback(null, result);
      }
    }
  });
}

Activity.countAll = function(callback) { // need to limit by current user
  db.run('SELECT tag_id, COUNT(activity_google_id) FROM activity_tag GROUP BY tag_id ORDER BY tag_id', function(error, result) {
    if (error) {
      console.log("in activity error");
      callback(error, undefined);
    } else {
      console.log("in activity yay");
      callback(null, result);
    }
  });
}
