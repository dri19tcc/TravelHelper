var massive = require('massive');
var connectionString = "postgres://localhost/travel_helper";

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
