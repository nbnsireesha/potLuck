$(document).ready(function() {
	$(".joinForm").hide();
	$(document).on("click", ".join", joinPotLuck);
	$(document).on("click", ".addInfo", addInfo);

	var potLuckFood = $("#food");
	var potLuckId= $("#potLuckId");

	function joinPotLuck(){
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
			.done(function(data){
				$(".joinForm").hide();
			})
			.fail(function(err){
				console.log(err);
			});
	}

	
});