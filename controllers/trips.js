var Trips = require('../models/trip');

TripsController = {
  getTrips: function(req, res) {
    res.status(200).json({whatevs: 'whatevs!!!'})
  }
}

module.exports = TripsController;
