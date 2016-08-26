var massive = require('massive');

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  var connectionString = "postgres://localhost:27253/travel_helper";
} else {
  var connectionString = "postgres://mapify.us-west-2.elasticbeanstalk.com/travel_helper";
}

var db = massive.connectSync({connectionString : connectionString});

db.setup.schema([], function(err, res) {
  if(err) {
    throw(new Error(err.message))
  }
  console.log("yay schema!");
  process.exit();
});
