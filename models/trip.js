var app = require('../app');
var db = app.get('db');

var Trip = function() {
  console.log("this is this: ", this);
};

Trip.find_all = function(googleID, callback) {
  db.users.find({google_id: googleID}, function(err, res) {
    if (err) {
      callback(err, undefined)
    } else {
      if (res) {
        var user = res;
        console.log("This is user", user);
      }
    }
  });
};

module.exports = Trip;
