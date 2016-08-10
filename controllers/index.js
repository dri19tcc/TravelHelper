var Index = require('../models/index');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      var user = req.session.passport.user;
      Index.findOrCreate(user, function(error, result, next) {
        if (error) {
          next(error);
        } else {
          // var locals = IndexController.locals
          // console.log(locals);
          var loggedIn = req.session.passport ? true : false;
          res.render('index', {
            title: "Travel Helper",
            loggedIn: loggedIn  // This is for the sign in/logout feature
          })
        }
      }) // need callback function
      console.log(req.session.passport.user);
    }
  }

}

module.exports = IndexController;
