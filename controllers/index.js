var Index = require('../models/index');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      user = Index.findOrCreate(req.session.passport.user)
      console.log(req.session.passport.user);
    }
    var loggedIn = req.session.passport ? true : false;
    res.render('index', {
      title: "Travel Helper",
      loggedIn: loggedIn  // This is for the sign in/logout feature
    })
  }


}

module.exports = IndexController;
