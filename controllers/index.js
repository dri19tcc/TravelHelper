var Index = require('../models/index');

IndexController = {

  getIndex: function(req, res) {
    if (req.session.passport) { // if req.session.passport.id exists then user is currently signed in
      console.log(req.session.passport.user);
    }
    var loggedIn = req.session.passport ? true : false;
    res.render('index', {
      title: "Travel Helper",
      loggedIn: loggedIn  // This is for the sign in/logout feature
    })
  }


}

module.exports = IndexController

// def create
//     auth_hash = request.env['omniauth.auth']
//     user = User.find_or_create_from_omniauth(auth_hash)
//
//     if user
//       session[:user_id] = user.id
//       redirect_to users_path
//     else
//       flash[:notice] = "Nope"
//       redirect_to root_path
//     end
//   end
