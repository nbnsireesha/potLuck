var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../models');


router.post('/potLuck/food', function(req, res){
	console.log("post food");
	var userId = req.user.dataValues.id;
	var name = req.user.dataValues.username;
	var attending = req.body.attending;
	var food = req.body.food;
	var potLuckId =req.body.PotLuckId;
	req.checkBody('food', 'food is required').notEmpty();

	console.log("user name in food" +name);

	var errors = req.validationErrors();

	if(errors){
		res.render('dashbord',{
			errors:errors
		});
	}else{
		var foodInfo = {
			usename: name,
			coming: attending,
			food: food,
			idOfPotLuck: potLuckId,
			UserId: userId
		}
		db.UserPotluck.create(foodInfo, function(err, data){
			if(err) throw err;
		});
		res.redirect('/dashbord/dashbord');
	}
	

})

module.exports = router;