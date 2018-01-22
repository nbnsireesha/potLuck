var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var app = express();
var LocalStrategy = require('passport-local').Strategy;

var db = require('../models');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// // dashbord
// router.get('/dashbord', function(req, res){
// 	res.render('dashbord');
// });


// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var phone = req.body.phone;
	var hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('phone', 'Phone Number is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = {
			name: name,
			email: email,
			username: username,
			phoneNo: phone,
			password: hashedPassword
		};

		db.User.create(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});
passport.use(new LocalStrategy(
  function(username, password, done) {//function(email,pass,done)
  	console.log(username);
    db.User.findOne({//db.User.findByEmail--WRITE findByEmail function in users in models
      where: {
        'username': username 
      }
    }).then(function (user) {
      if (user == null) {
        return done(null, false, { message: 'Unknown User' });
      }
      // if (user.password === password) {
      //   return done(null, user);
      // }
	    bcrypt.compare(password, user.password, function(err, res) {
	    	// console.log(user);
	    	// console.log(res);
	    	if (err) {
	    		throw err;
	    	}
	    	if(res){
	    		return done(null, user, {message: 'you logged in'});
	    	}else{
	    		return done(null, false, { message: 'Incorrect password.' });
	    	}
		});
    })
  }
))
passport.serializeUser(function(user, done) {
	 done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	// console.log("passpot de");
	// console.log(id);
  db.User.findById(id).then(function (user) {
  	// console.log("error"+err+ "user" ,user);
    done(null, user);
  });
});

router.post('/login',
  passport.authenticate('local'), //{successRedirect:'/dashbord/dashbord', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
  	userID = req.user.id;
  	console.log("user id of the user" + userID);
    //res.redirect(`/dashbord/dashbord?userId=${userID}`);
    res.redirect('/dashbord/dashbord');
  });

router.get('/logout', function(req, res){ 
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;