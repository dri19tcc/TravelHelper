var app = require('../app');
var db = app.get('db');

var User = function (user) {
  this.googleID = user.id;
  this.name = user.displayName;
  this.image_url = user.photos[0].value;
};

User.findOrCreate = function(user, callback) {
  var googleID = user.id;

  db.users.findOne({googleID: googleID}, function(error, result) {
    if (error) {
      callback(error, undefined)
    } else {
      if (result) {
        var newUser = new User(result)
        callback(null, newUser)
      } else {
        User.save(user, callback)
      }
    }
  })
}

User.save = function(user, callback) {
  var googleID = user.id;
  var name = user.displayName;
  var image_url = user.photos[0].value;
  db.user.save({googleID: googleID, name: name, image_url: image_url}, function(error, result) {
    if (error) { callback(error, undefined)}

    var newUser = new User(result)
    callback(null, newUser)
  })
}

module.exports = User;
