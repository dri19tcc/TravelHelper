var app = require('../app');
var db = app.get('db');

var Activity = function(activity) {
  this.name = activity.name,
  this.address = activity.address,
  this.website = activity.website,
  this.photoUrl = activity.photo_url,
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
        return new Activity(activity)
      }));
    };
  })
};

module.exports = Activity;
