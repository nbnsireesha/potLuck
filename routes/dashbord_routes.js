var express = require('express');
var router = express.Router();

var db = require('../models');

router.get('/dashbord', function(req, res){
	console.log("user id"+req.query.userId);
	console.log("here in dashbord-routes");
	res.render('dashbord',{id:req.query.userId});
});

module.exports = router;