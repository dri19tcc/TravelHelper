var app = require('../app');
var db = app.get('db');

var User = function (user) {
  this.id = user.id;
  this.googleID = user.googleID
  this.displayName = user.name;
  this.email = user.email;
  this.image_url = user.image_url
};

User.findOrCreate = function(id, callback) {
  // db.users.find({id: id}, function(error, user) {
  //   if(error || !user) {
  //     callback(new Error("User not found"), undefined)
  //   } else {
  //     callback(null, new User(user))
  //   }
  // })
}

module.exports = User
