$(document).ready(function() {
	$(".joinForm").hide();
	$(document).on("click", ".join", joinPotLuck);
	$(document).on("click", ".addInfo", addInfo);

	var potLuckFood = $("#food");
	var potLuckId= $("#potLuckId");
	var flag = 0;

	function joinPotLuck(event){
		$(".potLuck-container").hide();
		$(".potLuck-FoodContainer").hide();
		$(".fooInfo").hide();
		$(".hostPotForm").hide();
		$(".inviteForm").hide();
		//$(".alert-success").hide();


		console.log("inside joinPotLuck");
		$(".joinForm").show();
		event.preventDefault();

	}

	function addInfo(event){
		var radioValue;
		event.preventDefault();
	    // $("input[type='button']").click(function(){
            radioValue = $("input[name='attending']:checked").val();
            console.log(radioValue);
        // });
	    console.log("---radio value---"+radioValue);
	    console.log("inside create potluck(2)");
	    upsertPotLuckFood({
	      attending: radioValue,
	      food: potLuckFood.val().trim(),
	      PotLuckId: potLuckId.val().trim()
	    });

	}

	var bodyContainer = $(".body-container");
	

	function upsertPotLuckFood(foodData){
		
		console.log(" inside upsertPotLuckFood");
		$.post("/potLuckFood/potLuck/food", foodData)
		.done(function(results) {

			if((results.data) === "your potluckId is invalid"){

				var alertDiv = $("<div>");
				alertDiv.addClass("alert alert-danger");
				alertDiv.text("Your potluckId is invalid");
					   
				bodyContainer.append(alertDiv);
				$(".alert-danger").show().delay(3000).fadeOut();
			}

			console.log("done");
			$(".joinForm").hide();
			potLuckFood.val("");
			potLuckId.val("");

		}).fail(function(err){
			// var flag = 0;
			console.log("fail");
			console.log(err);
			$(".joinForm").hide();
			$(".alert-danger").hide();
			//$(".alert-success").show();
			//alert("you have already entered the food for this potluck");


			var alertDiv = $("<div>");
			alertDiv.addClass("alert alert-danger");
			alertDiv.text("You have already entered the food for this PotLuck");
				   
			bodyContainer.append(alertDiv);
			$(".alert-danger").show();
			
			potLuckFood.val("");
			potLuckId.val("");


			$(".alert-danger").show().delay(3000).fadeOut();

		});

		// $.ajax({
		// 	method: "POST",
		// 	url: "/potLuckFood/potLuck/food",
		// 	async: false

		// })
		// .done(function(results){
		// 	console.log("done");
		// 	$(".joinForm").hide();
		// 	potLuckFood.val("");
		// 	potLuckId.val("");

		// })
		// .fail(function(err){

		// 	//var flag = 0;
		// 	// console.log("fail");
		// 	console.log(err);
		// 	$(".joinForm").hide();
		// 	//$(".alert-success").show();
		// 	//alert("you have already entered the food for this potluck");


		// 	var alertDiv = $("<div>");
		// 	alertDiv.addClass("alert alert-danger");
		// 	if(flag == 0){
		// 	    	alertDiv.text("You have already entered the food for this PotLuck");
		// 		    flag = 1;
		// 		    bodyContainer.append(alertDiv);
		// 	}
		// 	potLuckFood.val("");
		// 	potLuckId.val("");


		// 	$(".alert-danger").show().delay(3000).fadeOut();

		// })
	}

	
});