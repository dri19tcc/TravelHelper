var express = require('express');
var router = express.Router();

var Controller = require('../controllers/trips');

router.get('/', Controller.getTrips);

module.exports = router;
