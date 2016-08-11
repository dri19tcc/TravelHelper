var app = require('../app');
var db = app.get('db');

var Trip = function(trip) {
  this.tripID = trip.id,
  this.tripName = trip.name,
  this.tripUpdate = trip.modified_date
};

Trip.find_all = function(googleID, callback) {
  db.find_all_tags([googleID], function(error, trips) {
    console.log(trips);
    callback(null, trips.map(function(trip) {
      return new Trip(trip)
    }));
  });
};

// Trip.find_all = function(googleID, callback) {
//   db.users.find({google_id: googleID}, function(err, res) {
//     if (err) {
//       callback(err, undefined)
//     } else {
//       if (res) {
//         var user = res;
//         console.log("This is user", user);
//
//       }
//     }
//   });
// };

module.exports = Trip;
