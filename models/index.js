var app = require('../app');
var db = app.get('db');

var User = function (user) {
  this.id = user.id;
  this.name = user.name;
  this.email = user.email;
  this.image_url = user.image_url
};

// User.find_by_id = function(id, callback) {
//   db.users.findOne({id: id}, function(error, user) {
//     if(error || !user) {
//       callback(new Error("User not found"), undefined)
//     } else {
//       callback(null, new User(user))
//     }
//   })
// }

module.exports = User


// User.findOrCreate({
//   googleId: profile.id,
//   googleName: profile.getName,
//   googleImage: profile.getImageUrl,
//   googleEmail: profile.getEmail
// }
