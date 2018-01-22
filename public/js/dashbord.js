$(document).ready(function() {
	$(".hostPotForm").hide();
	$(".inviteForm").hide();
	// var db = require('../models');
	var userContainer = $(".user-container");
	//$(document).on("click", "button.potLuckInfo", showAllPotLucks);
	$(document).on("click", "#potLuckCreate", creatPotLuck);
	$(document).on("click", ".createOne", submitPotLuck);
	//$(document).on("click", "button.inviteGuests", inviteGuests);
	$(document).on("click", ".inviteGuests", inviteGuests);
	$(document).on("click", ".invite", invite);

	var potLuckDate = $("#date");
	var potLuckTheme = $("#theme");
	var potLuckDestenation = $("#destination");

	var date = new Date();
	console.log(date);
	var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  	var fullDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
  	console.log("-----fullDate----"+fullDate);

	function creatPotLuck(event){
		console.log("inside createPotlock");
		$(".hostPotForm").show();
		event.preventDefault();
	}
	function submitPotLuck(event){
		event.preventDefault();
		if (!potLuckDate.val().trim()) {
	      return;
	    }
	    console.log("inside create potluck(2)");
	    upsertPotLuck({
	      date: potLuckDate.val().trim(),
	      hostedAt: potLuckDestenation.val().trim(),
	      theme: potLuckTheme.val().trim(),
	      createdAtDateOnly: fullDate
	    });

	}
	function upsertPotLuck(potLuckData){
		console.log("inside upsert");
		$.post("/potLuck/potLuck", potLuckData)
			.done(function(data){
				$(".hostPotForm").hide();
			})
			.fail(function(err){
				console.log(err);
			});
	}

	// invites guests
	function inviteGuests(event){
		console.log("inside invitGuests");
		$(".inviteForm").show();
		event.preventDefault();
	}

	var guestEmails = $("#emails");

	function invite(event){
		event.preventDefault();
		if (!guestEmails.val().trim()) {
	      return;
	    }
	    console.log("inside create potluck(2)");
	    upsertInvite({
	      guestEmails: guestEmails
	        .val()
	        .trim()
	    });
	}

	function upsertInvite(guestData){
		console.log("inside upsert invite");
		$.post("/potLuck/potLuck/update", guestData)
			.done(function(data){
				$(".inviteForm").hide();
			})
			.fail(function(err){
				console.log(err);
			});
	}
}); 