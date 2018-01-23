var express = require('express');
var router = express.Router();
var passport = require('passport');
const nodemailer = require('nodemailer');
var Sequelize = require('sequelize');
var dateFormat = require('dateformat');
var now = new Date();

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
	console.log(req.body);
	var destination = req.body.hostedAt;
	console.log("-------destination--------" +destination);
	var theme = req.body.theme;
	var createdAtDateOnly = req.body.createdAtDateOnly;
	console.log("-------theme------"+theme);
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
			theme: theme,
			hostedAt: destination,
			createdAtDateOnly: createdAtDateOnly,
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
var phoneNo;

//addes email's of guests to potluck table
router.post('/potLuck/update', function(req, res){

	const Op = Sequelize.Op;
	console.log("inside potluck update");

	var compareDate = dateFormat(now, "d mmmm yyyy");
	console.log("compareDate :" +compareDate);
	//console.log("----req----"+req.body);

	var guestEmails = req.body.guestEmails;
	// req.checkBody('emails', 'emails are required').notEmpty();
	// console.log("guest emails are:" +guestEmails);

	// var errors = req.validationErrors();

	UserId = req.user.dataValues.id;
	userName = req.user.dataValues.username;
	userEmail = req.user.dataValues.email;
	phoneNo = req.user.dataValues.phoneNo;

	console.log("findone userId****"+UserId);

	// if(errors){
	// 	res.render('dashbord',{
	// 		errors:errors
	// 	});
	// 	console.log(errors);
	// } else{
		console.log("guestEmails:" +guestEmails);
		db.PotLuck.findOne({
			where:{
					UserId: UserId
					// createdAtDateOnly: {

					// 	[Op.eq]: compareDate

					// }
			}
		}).then(function(data){

			console.log(arguments);
			if(!data){
				console.log("no data is selected");
				return;
			}
			console.log(data);
			console.log("emails data"+JSON.stringify(data));
			emails = JSON.stringify(data.guestEmails);
			//addData(guestEmails);
			if(emails != null){
				var allEmails = emails +"," +guestEmails;
			}
			else{
				allEmails = guestEmails;
			}
			
			console.log("--all emails--"+allEmails);
			var potluckadd = {
				guestEmails: allEmails
				// UserId: req.user.dataValues.id
			};
			db.PotLuck.update(potluckadd, 
			{
				where:{	
					UserId: req.user.dataValues.id,
					createdAtDateOnly: {

						[Op.eq]: compareDate

					}
				}

			}, 
			function(err, potLuck){
					if(err) throw err;
					console.log(potLuck);
			});

		}).catch(function(err){
			console.log(err);
		});
		db.PotLuck.findOne({
			where: {
				UserId: UserId
				// createdAt: {
				// 	[Op.eq]: new Date()
				// }
			}
		}).then(function(potLuckInfo){
			potLuckDate = JSON.stringify(potLuckInfo.date);
		 	potLuckId = JSON.stringify(potLuckInfo.id);
		 	theme = JSON.stringify(potLuckInfo.theme);
		 	destination = JSON.stringify(potLuckInfo.hostedAt);

		 	//function call which sends req mails to the guest
		 	sendemailRequest(guestEmails, potLuckDate, potLuckId, theme, destination);
			req.flash('success_msg', 'Invited Guests');

			res.redirect('/dashbord/dashbord');
		})

})
//function that sends email requests
function sendemailRequest(guestEmails, potLuckDate, potLuckId, theme, destination){

	// var outputData = {
	// 	potLuckDate: potLuckDate,
	// 	potLuckId: potLuckId,
	// 	userEmail: userEmail,
	// 	userName: userName
	// }

	var outputData = `
		p>You have a new POTLUCK request</p>
    	<h3>Contact Details</h3>
    	<ul>  
	      <li>Name: ${userName}</li>
	      <li>Email: ${userEmail}</li>
	      <li>Phone Number : ${phoneNo}</li>
	      <li>Theme of the PotLuck: ${theme}</li>
	      <li>Hosted At: ${destination}</li>
	      <li>Date of PotLuck: ${potLuckDate}</li>
	      <li>Id of PotLuck: ${potLuckId}</li>
	    </ul>
	`;
	// console.log(outputData);
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
	console.log("created trasporter");

	  // setup email data with unicode symbols
	var mailOptions = {
	    from: userName +'&lt;' +userEmail +'&gt;', // sender address
	    to: guestEmails, // list of receivers
	    subject: 'POTLUCK Request', // Subject line
	    text: 'Hello world?', // plain text body
	    html: outputData // html body
	};
	console.log("-----mailOptions----" +JSON.stringify(mailOptions));

	  // send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log('error and trasporter', error);
	    }
	    msg = "emailed the request";
	    //res.render('dashbord', {success_msg: msg});
	    res.flash('success_msg', 'emailed the request');
	    // res.render('dashbord');
	});
}

// function getPotLuckDetails(){

// 	const Op = Sequelize.Op;

// 	db.PotLuck.findOne({
// 		where: {
// 			UserId: UserId,
// 			createdAt: {
// 				[Op.eq]: new Date()
// 			}
// 		}
// 	}).then(function(potLuckInfo){

// 		return potluckInfo;
// 	})

// }
//get all potluck info of the user that they host
router.get("/user/potLuck",function(req,res){
	db.PotLuck.findAll({
		where:{
			UserId: req.user.dataValues.id
		}
	}).then(function(potLuckData){
		// res.json(potLuckData)
		console.log("------data---"+JSON.stringify(potLuckData))
		var data = JSON.stringify(potLuckData);
		//res.redirect('/dashbord/dashbord',{data:data});
		//res.render(`/dashbord/dashbord?${JSON.stringify(res.json(potLuckData))}`);
		//res.render('dashbord',{potLuckData: potLuckData});
		res.json({potLuckData: potLuckData});
	})
})

module.exports = router;

