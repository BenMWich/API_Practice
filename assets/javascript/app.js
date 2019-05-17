$(document).ready(function(){

	//Test

	alert("Instructions: \nClick a category to display gifs. Click on a still image to play the gif, and click on it again to stop the gif.\nYou can change which gifs are shown by updating the result offset with an integer. \n\nNOTE: By default, the public beta API key from Giphy is used and might be rate limited. Using your own key is preferable.");

	//String of topics
	var topics = ["Sushi", "Pie", "Steak", "Seafood"];

	//The api being used, the key, the search term, and how many images to get. It's broken into pieces for easy editing
	var uKey = "dc6zaTOxFJmzC";
	var api = "https://api.giphy.com/v1/gifs/search?";
	var apiKey = "&api_key="+uKey+"&q=";
	var searchTerm = "";
	var limit = "&limit=12";
	var limNum = 12;
	var uOffset = "&offset="+0;
	//The full api url
	//var testURL = api + apiKey + searchTerm + limit;
	//The actual gif urls gotten from the api
	var acquiredURLStill = "";
	var acquiredURLActive ="";
	//Array of active image ID's. 0 = inactive, 1 = active
	var activeID = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];



	//Is used to add more buttons from user input
	$("#addGif").click(function(){
		$("#buttonContainer").empty();
		var gName = $("#gName").val();
		if(gName != "")
		{
			topics.push(gName);
		}
		updateTopics();

	});


	//Updates the api url with the user's key
	$("#updateAPI").click(function(){
		var apiName = $("#apiName").val();
		if(apiName != "")
		{
			uKey = apiName;
			apiKey = "&api_key="+uKey+"&q=";
		}

	});


	//Updates the offset so different results are shown
	$("#setOffset").click(function(){
		var offSet = $("#upOffset").val();
		if(upOffset != "")
		{
			uOffset = "&offset="+offSet;

			for(i = 0; i < limNum; i++)
			{
				$("#pictureContainer").empty();
				getPictures(i);
			}

		}

	});



	//Populates the page with the initial buttons
	updateTopics();

	//Outputs the acquired data to the log (troubleshooting)
	//var testGet.done(function(data) { console.log("Action Succeeded", data); });

	//Attaches click events to the buttons
	$("#buttonContainer").on("click", "button", function(e){
		//Stops multiple image sets from being added
		e.stopPropagation();

		$("#pictureContainer").empty();
		searchTerm = this.id;
			
		for(i = 0; i < limNum; i++)
		{
			getPictures(i);
		}
		
		//Clears out the array of active IDs since the images on screen changed
		activeID = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	});



	//Listens for clicks on the images, and then plays or stops the image that was clicked
	$("#pictureContainer").on("click", "img", function(){


		//If the picture clicked is inactive, activate it
		if(activeID[this.id] == 0)
		{
			activatePicture(this.id);
			activeID[this.id] = 1;
		}

		//If the picture clicked is active, deactivate it
		else if(activeID[this.id] == 1)
		{
			deactivatePicture(this.id);
			activeID[this.id] = 0;
		}





		//Old method, overly complicated
		/*
		//Searches to see if the clicked image is active
		for(i = 0; i < activeID.length; i++)
		{
			if(this.id == activeID[i])
			{
				count++;
				break;
			}
		}

		//If the image is active, deactivate the image and removes it from the array of active IDs
		if(count > 0)
		{
			deactivatePicture(this.id);
			count = 0;
			var elementPOS = activeID.indexOf(this.id);
			activeID.splice(elementPOS, 1);
		}
		//If the image isn't active, activate the image and add it to the array of active IDs
		else if(count == 0)
		{
			activatePicture(this.id);
			activeID.push(this.id);
		}
		*/

	});




	//Populates the page with still gifs when called
	function getPictures(pos)
	{
		var fullURL = api + apiKey + searchTerm + limit + uOffset;
		var getData = $.get(fullURL, function(data){
			acquiredURLStill = data.data[pos].images.original_still.url;
			var rating = data.data[pos].rating; 
			//Adds a text/picture container for each image
			$("#pictureContainer").append('<div class="textPic"><p>Rating: ' + rating+'<p><img id="'+pos+'"" src="'+acquiredURLStill+'"></div>');



		});
	}

	//Plays the gif
	function activatePicture(pos)
	{
		var fullURL = api + apiKey + searchTerm + limit + uOffset;
		var getData = $.get(fullURL, function(data){
			acquiredURLActive = data.data[pos].images.original.url;
			$("#"+pos).attr("src", acquiredURLActive);

		});
	}

	//Stops the gif
	function deactivatePicture(pos)
	{
		var fullURL = api + apiKey + searchTerm + limit + uOffset;
		var getData = $.get(fullURL, function(data){
			acquiredURLStill = data.data[pos].images.original_still.url;
			$("#"+pos).attr("src", acquiredURLStill);

		});		
	}



	//Reloads the buttons
	function updateTopics()
	{

		for(i = 0; i < topics.length; i++)
		{
			var buttonName = topics[i];
			$("#buttonContainer").append('<button id="'+buttonName+'">' +buttonName+ '</button>');
		}

	}



});