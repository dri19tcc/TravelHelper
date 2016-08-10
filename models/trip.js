var app = require('../app');
var db = app.get('db');

var Trip = function () {
  console.log("this is this: ", this);
};

module.exports = Trip;
