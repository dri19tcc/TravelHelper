var massive = require('massive');

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  var connectionString = "postgres://"+process.env.USERNAME+":"
                                      +process.env.PASSWORD+"@"
                                      +process.env.HOSTNAME+":"
                                      +process.env.PORT+"/"
                                      +process.env.DB_NAME;
} else {
  var connectionString = "postgres://localhost:5432/travel_helper";
}

var db = massive.connectSync({connectionString : connectionString});

var tags = require("../db/seeds/tags.json");
var user_tags = require("../db/seeds/user_tags.json");

for (var tag of tags) {
  console.log(tag);
  db.tag.saveSync(tag)
};

for (var tag of user_tags) {
  console.log(tag);
  db.user_tag.saveSync(tag)
};

console.log("seeding done!");
process.exit();
