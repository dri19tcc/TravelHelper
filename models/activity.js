var app = require('../app');
var db = app.get('db');

var Activity = function(activity) {
  this.activityName = activity.name,
  this.activityID = activity.id
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
