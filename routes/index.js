var express = require('express');
var router = express.Router();

var Controller = require('../controllers/index');

/* GET home page. */
router.get('/', Controller.getIndex);
router.get('/logout', Controller.getLogout);
router.get('/trips', Controller.isLoggedIn, Controller.newTrips);
router.get('/trips/:id', Controller.getTrips)

module.exports = router;
