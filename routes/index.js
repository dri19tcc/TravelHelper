var express = require('express');
var router = express.Router();

var Controller = require('../controllers/index');

/* GET home page. */
router.get('/', Controller.getIndex);

router.get('/logout', Controller.getLogout);

router.get('/trips', Controller.isLoggedIn, Controller.newTrips);

router.get('/trips/findActivities', Controller.findAllActivitiesByTag);

router.get('/trips/:id', Controller.showTrip);

router.post('/trips/new', Controller.createTrip);

router.post('/trips/addActivity', Controller.addActivity);

router.post('/trips/:id/delete', Controller.deleteActivity);

module.exports = router;
