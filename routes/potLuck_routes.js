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
		db.PotLuck.create(newPotluck).then(function(potLuck){
			console.log("potluck info"+potLuck);
			res.json({data:potLuck});

		}).catch(function(err){
			console.log(err);
		})
		
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

	var guestEmails = req.body.guestEmails;
	var idInvite = req.body.idInvite;
	// req.checkBody('emails', 'emails are required').notEmpty();
	// console.log("guest emails are:" +guestEmails);

	// var errors = req.validationErrors();

	UserId = req.user.dataValues.id;
	userName = req.user.dataValues.username;
	userEmail = req.user.dataValues.email;
	phoneNo = req.user.dataValues.phoneNo;

	console.log("findone userId****"+UserId);

		console.log("guestEmails:" +guestEmails);
		db.PotLuck.findOne({
			where:{
					UserId: UserId,
					id: idInvite
			}
		}).then(function(data){

			console.log(arguments);
			if(data == null){
				console.log("invalid potluck for the user");
				error = "invalid potluck for the user";
				res.json({data:error});
				return;
			}
			else{
				emails = JSON.stringify(data.guestEmails);
				console.log("inside else");
				if(emails == "null"){
					var allEmails = guestEmails;
				}
				else{
					 allEmails = emails +"," +guestEmails;
				}
				
				var potluckadd = {
					guestEmails: allEmails
				};
				db.PotLuck.update(potluckadd, 
				{
					where:{	
						UserId: req.user.dataValues.id,
						id: idInvite
					}

				}).then(function(potLuck){
						//if(err) throw err;
						//emailCode();

						db.PotLuck.findOne({
							where: {
								UserId: UserId,
								id:idInvite
							}
						}).then(function(potLuckInfo){
							potLuckDate = JSON.stringify(potLuckInfo.date);
						 	potLuckId = JSON.stringify(potLuckInfo.id);
						 	theme = JSON.stringify(potLuckInfo.theme);
						 	destination = JSON.stringify(potLuckInfo.hostedAt);

						 	//function call which sends req mails to the guest
						 	sendemailRequest(guestEmails, potLuckDate, potLuckId, theme, destination);
							//req.flash('success_msg', 'Invited Guests');

							//res.redirect('/dashbord/dashbord');
						})

				});

			}//end of else

		}).catch(function(err){
			console.log(err);
		});

});
//function that sends email requests
function sendemailRequest(guestEmails, potLuckDate, potLuckId, theme, destination){


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


//get all potluck info of the user that they host
router.get("/user/potLuck",function(req,res){
	db.PotLuck.findAll({
		where:{
			UserId: req.user.dataValues.id
		}
	}).then(function(potLuckData){
		console.log("------data---"+JSON.stringify(potLuckData))
		var data = JSON.stringify(potLuckData);
		res.json({potLuckData: potLuckData});
	})
})

module.exports = router;

