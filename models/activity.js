var app = require('../app');
var db = app.get('db');

var Activity = function(activity) {
  this.activityName = activity.name,
  this.activityID = activity.id
};

Activity.activity_by_tag = function(tagID, callback) {
  callback(null, ["adriana", "chris"]); // join tables to return activities from tag
  // db.find_all_tags([googleID], function(error, trips) {
  //   if (error) {
  //     callback(error, undefined);
  //   } else {
  //     callback(null, trips.map(function(trip) {
  //       return new Activity(trip)
  //     }));
  //   };
  // });
};

module.exports = Activity;
