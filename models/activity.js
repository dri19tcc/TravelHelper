var app = require('../app');
var db = app.get('db');

var Activity = function(activity) {
  this.name = activity.name,
  this.address = activity.address,
  this.website = activity.website,
  this.longitude = activity.longitude,
  this.latitude = activity.latitude,
  this.phone = activity.phone,
  this.google_id = activity.google_id
};

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

module.exports = Activity;
