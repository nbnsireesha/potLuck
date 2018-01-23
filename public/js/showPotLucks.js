$(document).ready(function() {
	$(".potLuck-container").hide();

	var potLuckList = $("tbody");
	var potLuckContainer = $(".potLuck-container");

	$(document).on("click", ".potLuckInfo", getPotLuckInfo);

	function getPotLuckInfo(event){
		event.preventDefault();
		console.log("get potluck info");

		$(".potLuck-FoodContainer").hide();
		$(".hostPotForm").hide();
		$(".fooInfo").hide();
		$(".joinForm").hide();
		$(".inviteForm").hide();
		//$(".alert-success").hide();
		$("#tbodyInfo").empty();

		$("#theadInfo").show();
		$(".potLuck-container").show();
		$.get("/potLuck/user/potLuck", function(data){

				console.log("inside ajax" +JSON.stringify(data));
				if (data.potLuckData.length !== 0) {
					//$(".alert-danger").hide();
	    			for (var i = 0; i < data.potLuckData.length; i++) {
	     				 var row = $("#potlucktable > tbody");
	     				 row.addClass("eventsInTable");
	     				 console.log(data.potLuckData[i].guestEmails);
						 row.append("<tr><td>" + data.potLuckData[i].id + "</td><td>" + data.potLuckData[i].date + "</td><td>"
	      				+ data.potLuckData[i].guestEmails + "</td></tr>");
	     				 $("#potlucktable").append(row);

	   					 }

	 			} else {
	 				renderEmpty();
	 			}
			
		})
	}

	// Function for handling what to render when there are no potLucks
	function renderEmpty(){
		//$(".alert-success").show();
		$("#potLuckInfoH1").hide();
		$("#theadInfo").hide();
		var alertDiv = $("<div>");
	    alertDiv.addClass("alert alert-danger");
	    alertDiv.text("You must create an Potluck");
	    potLuckContainer.append(alertDiv);

	    $(".alert-danger").show().delay(3000).fadeOut();

	}

});