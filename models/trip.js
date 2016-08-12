var app = require('../app');
var db = app.get('db');

var Trip = function(trip) {
  this.tripID = trip.id,
  this.tripName = trip.name,
  this.tripUpdate = trip.modified_date
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
          db.user_tag.save({user_id: user[0].id, tag_id: item.id}, function(err, res) {
            if (error) {
              callback(error, undefined);
            } else {
              // console.log("table updated");
            };
          })
        };
      });
      callback(null, item);
    }
  })
}

Trip.findOneTrip = function(tripID, callback) {
  db.tag.findOne({id: tripID}, function(error, trip) {
    if (error) {
      callback(error, undefined);
    } else {
      // console.log(trip);
      callback(null, trip);
    };
  });
}


module.exports = Trip;
