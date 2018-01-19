var express = require('express');
var router = express.Router();
var passport = require('passport');
const nodemailer = require('nodemailer');
var Sequelize = require('sequelize');


var db = require('../models');

router.get('/potLuck', function(req, res){
	res.render('dashbord');
});

//add date of the potluck to the potluck table
router.post('/potLuck', function(req, res){
	console.log("inside potluck");
	console.log(req.user.dataValues.id);//.User.dataValues.id);
	console.log("inside potluck");
	var date = req.body.date;
	req.checkBody('date', 'date is required').notEmpty();
	req.checkBody('date', 'enter correct formated date').isISO8601();
	//console.log(req.checkBody('date', 'enter correct formated date'));

	var errors = req.validationErrors();

	if(errors){
		res.render('dashbord',{
			errors:errors
		});
	} else{

		var newPotluck ={
			date: date,
			UserId: req.user.dataValues.id
		};
		db.PotLuck.create(newPotluck, function(err, potLuck){
			if(err) throw err;
			console.log(potLuck);
		});
		req.flash('success_msg', 'Created a potLuck, you can now invite guests');

		res.redirect('/dashbord/dashbord');
	}
});

var UserId;
var userName;
var userEmail;

//addes email's of guests to potluck table
router.post('/potLuck/update', function(req, res){

	const Op = Sequelize.Op;
	console.log("inside potluck update");


	var guestEmails = req.body.guestEmails;
	// req.checkBody('emails', 'emails are required').notEmpty();
	// console.log("guest emails are:" +guestEmails);

	// var errors = req.validationErrors();

	UserId = req.user.dataValues.id;
	userName = req.user.dataValues.username;
	userEmail = req.user.dataValues.email;

	// if(errors){
	// 	res.render('dashbord',{
	// 		errors:errors
	// 	});
	// 	console.log(errors);
	// } else{

		var potluckadd ={
			guestEmails: guestEmails
			// UserId: req.user.dataValues.id
		};
		db.PotLuck.update(potluckadd, 
			{
				where:{	UserId: req.user.dataValues.id,
						createdAt: {
							[Op.eq]: new Date()
						}
					}

			}, 
			function(err, potLuck){
					if(err) throw err;
					console.log(potLuck);
			});
		//function call which sends req mails to the guests
		sendemailRequest(guestEmails);
		req.flash('success_msg', 'Invited Guests');

		res.redirect('/dashbord/dashbord');
	// }

})
//function that sends email requests
function sendemailRequest(emails){
	var potluckInfo = getPotLuckDetails();
	var potLuckDate = potluckInfo.date;
	var potLuckId = potluckInfo.id;

	var outputData = {
		potLuckDate: potluckInfo.date,
		potLuckId: potluckInfo.id,
		userEmail: userEmail,
		userName: userName
	}
	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
	    // service:'gmail',
	    host: 'smtp.gmail.com',
	    port: 587,
	    secure: false, // true for 465, false for other ports
	    auth: {
	        user: 'potluckpeeps@gmail.com', // generated ethereal user
	        pass: 'potluckpeeps1'  // generated ethereal password
	    },
	    tls:{
	      rejectUnauthorized:false
	    }
	});

	  // setup email data with unicode symbols
	var mailOptions = {
	    from: userName +'&lt;' +userEmail +'&gt;', // sender address
	    to: emails, // list of receivers
	    subject: 'POTLUCK Request', // Subject line
	    text: 'Hello world?', // plain text body
	    html: outputData // html body
	};

	  // send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    req.flash('success_msg', 'emailed the request');
	    // res.render('dashbord');
	});
}

function getPotLuckDetails(){

	const Op = Sequelize.Op;

	db.PotLuck.findOne({
		where: {
			UserId: UserId,
			createdAt: {
				[Op.eq]: new Date()
			}
		}
	}).then(function(potLuckInfo){

		return potluckInfo;
	})

}
//get all potluck info of the user that they host
router.get("/user/potLuck",function(req,res){
	db.PotLuck.findAll({
		where:{
			UserId: req.user.dataValues.id
		}
	}).then(function(potLuckData){
		res.json(potLuckData)
	})
})

module.exports = router;

