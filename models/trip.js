var app = require('../app');
var db = app.get('db');

var Trip = function(trip) {
  this.tripID = trip.id,
  this.tripName = trip.name,
  this.tripUpdate = trip.modified_date
};

Trip.find_all = function(googleID, callback) {
  db.find_all_tags([googleID], function(error, trips) {
    callback(null, trips.map(function(trip) {
      return new Trip(trip)
    }));
  });
};


module.exports = Trip;
