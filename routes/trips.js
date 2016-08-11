var express = require('express');
var router = express.Router();

var Controller = require('../controllers/trips');
var Index = require('../controllers/index');

router.get('/', Index.isLoggedIn, Controller.getTrips);

module.exports = router;
