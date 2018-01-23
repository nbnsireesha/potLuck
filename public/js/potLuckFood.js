$(document).ready(function() {
	$(".joinForm").hide();
	$(document).on("click", ".join", joinPotLuck);
	$(document).on("click", ".addInfo", addInfo);

	var potLuckFood = $("#food");
	var potLuckId= $("#potLuckId");

	function joinPotLuck(){
		$(".potLuck-container").hide();
		$(".potLuck-FoodContainer").hide();
		$(".fooInfo").hide();
		$(".hostPotForm").hide();
		$(".inviteForm").hide();


		console.log("inside joinPotLuck");
		$(".joinForm").show();
		event.preventDefault();

	}

	function addInfo(){
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

	function upsertPotLuckFood(foodData){
		console.log(" inside upsertPotLuckFood");
		$.post("/potLuckFood/potLuck/food", foodData)
		.done(function(results) {
			console.log("done");
			$(".joinForm").hide();
			potLuckFood.val("");
			potLuckId.val("");

		}).fail(function(err){
			console.log("fail");
			console.log(err);
			$(".joinForm").hide();
			alert("you have already entered the food for this potluck");

		});
	}

	
});