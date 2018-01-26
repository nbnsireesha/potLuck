$(document).ready(function() {

	$(".fooInfo").hide();
	$(".potLuck-FoodContainer").hide();
	$(document).on("click", ".foodinfo", show);
	$(document).on("click", ".see", showfoodInfo);

	var bodyContainer = $(".body-container");

	var idOfPotLuck = $("#idOfPotLuck");

	function show(event){

		//$(".alert-success").hide();
		$(".fooInfo").show();
		event.preventDefault();
		$(".inviteForm").hide();
		$(".joinForm").hide();
		$(".hostPotForm").hide();
		$(".potLuck-container").hide();
		$(".potLuck-FoodContainer").hide();

	}

	function showfoodInfo(event){

		$("#tbodyfood").empty();
		$(".fooInfo").hide();
		$(".potLuck-FoodContainer").show();
		event.preventDefault();
		console.log("inside showfoodInfo");

		// upsertId({
		// 	id: idOfPotLuck.val().trim()
		// })
		upsertId();

	}
	function upsertId(){
		//id = JSON.stringify(id);
		//idPotLuck = "/?idOfPotLuck=" +id;
		//console.log("upsertId");

		var id = idOfPotLuck.val().trim();
		console.log("--id--"+id);
		//console.log("id of potluck***"+JSON.stringify(id));
		$.get("/potLuckFood/potLuck/food?idOfPotLuck="+id, function(data){
			console.log("potluck id data***"+ JSON.stringify(data));

			if(data.data.length == 0){
				$(".potLuck-FoodContainer").hide();
				var alertDiv = $("<div>");
				alertDiv.addClass("alert alert-info");
				alertDiv.text("No Information of this PotLuck yet");
						   
				bodyContainer.append(alertDiv);
				$(".alert-info").show().delay(4000).fadeOut();

			}

			if(data.data.length !== 0 ){
				for (var i = 0; i < data.data.length; i++) {
					var row = $("#potluckFood > tbody");
	     				 row.addClass("eventsInTable");
	     				 console.log(data.data[i].food);
						 row.append("<tr><td>" + data.data[i].usename + "</td><td>" + data.data[i].coming + "</td><td>"
	      				+ data.data[i].food + "</td></tr>");

	     				 $("#potluckFood").append(row);
				}
			}
			idOfPotLuck.val("");
		})

	}

});