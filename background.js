var lastPos = {};
var allTabs = [];
//do while
function getLocation(){
	if (navigator.geolocation) {
	  //console.log('Geolocation is supported!');
	  navigator.geolocation.getCurrentPosition(function(position) {
		lastPos["latitude"] =  position.coords.latitude;
		lastPos["longitude"] = position.coords.longitude;
	    console.log(lastPos["latitude"], lastPos["longitude"]);
	   // console.log(inDistance(34.074949, -118.441318));
		var inrange = 0;
		var set = JSONE.parse(localStorage.getItem('settings'));
	    for (var key in localStorage){
	    	if (key=='settings')
	    		continue;
	    	var locStore = JSON.parse(localStorage.getItem(key))[1];
	    	console.log(locStore['lat'], locStore['lng'],getDistance(locStore['lat'], locStore['lng']));
	    	console.log(JSON.parse(localStorage.getItem("settings"))[1]);
	    	if(getDistance(locStore['lat'], locStore['lng']) < set[1]){
	    		inrange++;
	   			set[0] = true;
	   			allTabs.forEach(function(tab){
	   				muteTab(tab);
	   			});
	    	}
	    }
	    if(inrange > 0){
	    	set[0] = false;
	    }
	    localStorage.setItem('settings', JSON.stringify(set));

	  }, showError);
	}
	else {
	  console.log('Geolocation is not supported for this Browser/OS.');
	}
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
	console.log("err");
            //x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
	console.log("err1");
            //x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
	console.log("err2");
           // x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
	console.log("err3");
           // x.innerHTML = "An unknown error occurred."
            break;
    }
}
var rad = function(x) {
  return x * Math.PI / 180;
};

function getDistance(lat2, lon2){
	var R = 6371e3; // metres
	let lat1 = lastPos["latitude"];
	let lon1 = lastPos["longitude"]; 
	var φ1 = rad(lat1);
	var φ2 = rad(lat2);
	var Δφ = rad(lat2-lat1);
	var Δλ = rad(lon2-lon1);

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	//get from local storage distance
	return d;
}

// i.e. tab is in a window of type "normal", not "popup", "panel", "app", or "devtools"
// We don't mute tabs in other types of windows because they are generally trusted
// and there is no UI control for unmuting them.
function muteTab(tab) {
	//settings.debug && console.log(`Muting tab ${tab.id}, url=${inspect(tab.url)}`);
	chrome.tabs.update(tab.id, {muted: true});
	//console.log("muted, " + tab.url);
}

function unmuteTab(tab) {
	chrome.tabs.update(tab.id, {muted: false});
	//console.log("unmuted, " + tab.url);
}

//
window.onload = function() {
	let settings = [false, 200, [,]];
	localStorage.setItem("settings", JSON.stringify(settings));
	//console.log(settings.length);
	chrome.windows.getAll({"populate" : true}, function(windows){
		allTabs = [];
		for(i = 0; i < windows.length; i++){
			allTabs = allTabs.concat(windows[i].tabs);
		};
		for(i = 0; i < allTabs.length; i++){
		//	muteTab(allTabs[i]);
		}
		//mute new tabs depending if set in settings
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
			if(changeInfo["url"]!= null){
				let settings = JSON.parse(localStorage.getItem("settings"));
	   	 		for(var i = 1; i < settings[1].length; i ++){
					console.log(changeInfo["url"]);
					if((changeInfo["url"]).match(settings[1][i]) != null){
						muteTab(tab);
					}
				}
			}
		});

		chrome.tabs.onCreated.addListener(function(newTab){
			let settings = JSON.parse(localStorage.getItem("settings"));
			if(settings[0]){
				muteTab(newTab);
				//console.log("mutednewtab");
			}

		});
	});

	chrome.extension.onConnect.addListener(function(port) {
	    console.log("Connected .....");
	    port.onMessage.addListener(function(msg) {
	    	  if(msg.request == 'mute')
	    	  {
	          	console.log("message recieved mute");
	        	for(i = 0; i < allTabs.length; i++){
					muteTab(allTabs[i]);
				}
	          }
	          if(msg.request == 'unmute')
	    	  {
	          	console.log("message recieved unmute");
	        	for(i = 0; i < allTabs.length; i++){
					unmuteTab(allTabs[i]);
				}
	          }
	    
	    });

	});
	chrome.alarms.onAlarm.addListener(function( alarm ) {
		getLocation();
	   // console.log("Got an alarm!");
	});
	//console.log("setting up");
	chrome.alarms.create("alarm", {delayInMinutes: 0, periodInMinutes: 0.1});
};