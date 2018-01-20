$(document).ready(function() {
	$(".potLuck-container").hide();

	var potLuckList = $("tbody");
	var potLuckContainer = $(".potLuck-container");

	$(document).on("click", "#potLuckInfo", getPotLuckInfo);

	function getPotLuckInfo(event){
		event.preventDefault();
		console.log("get potluck info");
		$(".potLuck-container").show();
		$.get("potLuck/user/potLuck", function(data){
			var rowsToadd = [];
			for (var i = 0; i < data.length; i++) {
		        rowsToAdd.push(createPotLuckRow(data[i]));
		    }
		    renderPotLuckList(rowsToAdd);
		})
	}

	function renderPotLuckList(rows){

		potLuckList.children().not(":last").remove();
    	potLuckContainer.children(".alert").remove();

		if(rows.length){
			potLuckList.prepend(rows);
		}
		else{
			renderEmpty();
		}

	}
	// Function for handling what to render when there are no potLucks
	function renderEmpty(){

		var alertDiv = $("<div>");
	    alertDiv.addClass("alert alert-danger");
	    alertDiv.text("You must create an Potluck");
	    potLuckContainer.append(alertDiv);

	}

	//Function for creating a new list row for authors
	function createPotLuckRow(potLuckData){
		var newTr = $("<tr>");
	    newTr.data("potLuck", potLuckData);
	    newTr.append("<td>" + potLuckData.id + "</td>");
	    newTr.append("<td>" + potLuckData.date + "</td>");
	    newTr.append("<td>" + potLuckData.guestEmails + "</td>");
	    return newTr;

	}
});