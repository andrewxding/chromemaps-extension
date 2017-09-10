var port;
var loc = {};
var added = {};

var autocomplete;
var place;


function updatehtmlLocs(mykey, myplace){//add geocode param
	if (localStorage.getItem(mykey) != null) {
		//console.log("existing key");
		return;
	}
	if (mykey != null){
		//console.log("addded", myKey);
		//store the addresses geocoords and also its short name
		localStorage.setItem(mykey, JSON.stringify([myplace["name"], myplace["geometry"]["location"]]));
	}
		//append all the stored locations to the doc
	for (var key in localStorage){
		if(key == "settings")
			continue;
		if(added[key] != true){

			added[key] = true;

			var node = document.createElement("LI");
			var t = document.createTextNode(JSON.parse(localStorage.getItem(key))[0]);
			node.appendChild(t);
			node.classList.add('locationItem');

			var button = document.createElement("button");
			button.setAttribute("class", "btn btn-default btn-sm mybutton");
			button.setAttribute("name", key);
			button.addEventListener("click", function(e){
				this.parentNode.parentNode.removeChild(this.parentNode);
				localStorage.removeItem(this.name);
				added[key] = false;
			});

			var span = document.createElement("span");
			span.setAttribute("class", "glyphicon glyphicon-minus");

			button.appendChild(span);
			node.appendChild(button);

		    document.getElementById("locationHolder").appendChild(node);
		}
		
	}
	//clear the input form
	document.getElementById("locationInput").value = "";
}

window.onload = function() {
    //document.getElementById("submitButton").addEventListener("click", submitEnter);
    document.getElementById("locationInput").addEventListener("onFocus", geolocate);
    updatehtmlLocs(null);
    initAutocomplete();
    port = chrome.extension.connect({name: "GPS"});
	port.onMessage.addListener(function(msg) {
		location["latitude"] = msg.latitude;
		location["longitude"] = msg.longitude;
		console.log(msg.latitude);
	});
	buttonLoad();

    
}

function buttonLoad(){
	document.getElementById("muteall").addEventListener("click", function(){
		port.postMessage({request: "mute"});
		console.log("MuteAll request");
	});
	document.getElementById("unmuteall").addEventListener("click", function(){
		port.postMessage({request: "unmute"});
		console.log("Unmuteall Request");
	});
	document.getElementById("mutenew").addEventListener("click", function(){
		var temp = JSON.parse(localStorage.getItem("settings"));
		if (temp == null){
			//default settings
			temp = [false, 200, [,]];
			temp[0] = "false";
		}
		else{
			temp[0] = !temp[0];
		}
		//console.log(temp);
		//console.log(JSON.stringify(temp));
		localStorage.setItem("settings", JSON.stringify(temp));
	});
};



function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.SearchBox(
            /** @type {!HTMLInputElement} */
            (document.getElementById('locationInput')),
            //{types: ['geocode']}
            );

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('places_changed', function() {
        	var places = autocomplete.getPlaces();
        	place = places[0];
        	if (places.length == 0){
        		window.alert("No search results retrieved");
        		return;
        	} 	
        	//console.log(place);   	
        	updatehtmlLocs(document.getElementById("locationInput").value, place);
        	console.log(place);

        });
}      
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}