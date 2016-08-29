var express = require('express');
var router = express.Router();

var Controller = require('../controllers/index');

/* GET home page. */
router.get('/', Controller.getIndex);

router.get('/logout', Controller.getLogout);

router.get('/trips', Controller.isLoggedIn, Controller.newTrips);

router.get('/trips/findActivities', Controller.findAllActivitiesByTag); //api

router.post('/trips/addActivity', Controller.addActivity); //api

router.post('/trips/new', Controller.isLoggedIn, Controller.createTrip);

router.get('/trips/:id', Controller.showTrip);

router.post('/trips/:id/deleteActivity', Controller.deleteActivity); //api

router.post('/trips/:id/completeActivity', Controller.completeActivity); //api

module.exports = router;

// change any routes to api/addActivity etc.
//
