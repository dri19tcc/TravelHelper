var Index = require('../models/auth');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      console.log(req.session.passport.user);
    }
    var loggedIn = req.session.passport ? true : false;
    res.render('index', {title: "Travel Helper", loggedIn: loggedIn}) // can pass a boolean and can change to logout
  }


}

module.exports = IndexController
