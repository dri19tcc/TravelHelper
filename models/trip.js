var app = require('../app');
var db = app.get('db');

var Trip = function(trip) {
  this.tripID = trip.id,
  this.tripName = trip.name,
  this.tripUpdate = trip.modified_date
};

Trip.find_all = function(googleID, callback) { // left join instead of inner join
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
  var user = params[1];
  db.tag.insert({name: name, modified_date: new Date()},function(error, item) {
    if(error || !item) {
      callback(error || new Error("Could not retrieve tag"), undefined);
    } else {
      // need to update user tag table to assign item.id to user_id, expand params from controller, pass user id which is in request
      callback(null, item);
    }
  })
}


module.exports = Trip;
