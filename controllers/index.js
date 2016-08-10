var Index = require('../models/index');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      var user = req.session.passport.user;
      Index.findOrCreate(user, function(error, result, next) {
        if (error) {
            next(error);
        } else {
          var loggedIn = req.session.passport ? true : false;
          res.render('index', {
            title: "Travel Helper",
            loggedIn: loggedIn,  // This is for the sign in/logout feature
            username: result.name,
            image: result.image_url
          })
        }
      })
    } else {
      var loggedIn = req.session.passport ? true : false;
      res.render('index', {
        title: "Travel Helper",
        loggedIn: loggedIn  // This is for the sign in/logout feature
      })
    }
  }
}
  module.exports = IndexController;
