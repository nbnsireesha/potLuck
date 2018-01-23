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
		db.UserPotluck.create(foodInfo, function(data){
			console.log("success");
			res.redirect('/dashbord/dashbord');
		})
		.catch(function(err) {
			console.log("error in food " + err);
			res.status(500).send(err);
		});
		
	}
	

})

router.get("/potLuck/food", function(req, res){
	 var query = {};
	console.log("req query "+JSON.stringify(req.query));
	 query.idOfPotLuck = req.query.idOfPotLuck;
	console.log("--query--"+JSON.stringify(query));
	db.UserPotluck.findAll({
		where: query
	}).then(function(data){
		console.log("data***" +JSON.stringify(data));
		res.json({data:data});
	})

})

module.exports = router;