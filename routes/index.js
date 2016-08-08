var express = require('express');
var router = express.Router();
var Controller = require('../controllers/index')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Travel Helper' });
});

module.exports = router;
