$(document).ready(function() {
	$(".potlucktable").hide();

	var potLuckList = $("tbody");
	var potLuckContainer = $(".potLuck-container");

	$(document).on("click", "#potLuckInfo", getPotLuckInfo);

	function getPotLuckInfo(event){
		event.preventDefault();
		console.log("get potluck info");
		$(".potLuck-container").show();
		$.get("/potLuck/user/potLuck", function(data){
				console.log("inside ajax" +JSON.stringify(data));
				if (data.length !== 0) {
	    			for (var i = 0; i < data.length; i++) {
	     				 var row = $("#potlucktable > tbody");
	     				 row.addClass("eventsInTable");
						 row.append("<tr><td>" + data[i].id + "</td><td>" + data[i].date + "</td><td>"
	      				+ data[i].guestEmails + "</td>");
	      // row.append("<p>" + data[i].date + "</p>");
	      // row.append("<p>" + data[i].guestnames + "</p>");

	     				 $("#potlucktable").append(row);

	   					 }

	 			} else {
	 				renderEmpty();
	 			}
		});
	}


	// Function for handling what to render when there are no potLucks
	function renderEmpty(){

		var alertDiv = $("<div>");
	    alertDiv.addClass("alert alert-danger");
	    alertDiv.text("You must create an Potluck");
	    potLuckContainer.append(alertDiv);

	}

	
});