/*  
// Saves options to chrome.storage
var settings = {
  muteNewTabs:false,
  radius:100
};

function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
 /* chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
*/
///add a whitelist option page
//setings 0 = mute new
//settings[1] = whitelist
window.onload = function (){
  console.log("Start");
  document.getElementById("submitItem").addEventListener('click', handleClick);
  //for element in settings, append to it
  let urls = JSON.parse(localStorage.getItem("settings"))[1];
  console.log(urls);
  for(let i  = 0; i < urls.length; i++){
      addURL(urls[i]);
  }
}
function handleClick(){
    var settings = JSON.parse(localStorage.getItem("settings"));
   // console.log(settings.length);
   // console.log(document.getElementById("whitelist").value);
    //check if url is different
    //check if settings unset
    let j = document.getElementById("whitelist").value;
    //console.log(typeof(settings[1]));
    if(settings[1].indexOf(j) < 0 && j != null){
      settings[1] = settings[1].concat(j);
      addURL(j);
    }
    localStorage.setItem("settings", JSON.stringify(settings));
}

function addURL(j){
    if(j == null)
        return;
    let node = document.createElement("LI");
    let t = document.createTextNode(j);
    node.appendChild(t);
    node.addEventListener("click", function(){
     // console.log("mikiz");
       let temp = JSON.parse(localStorage.getItem("settings"));
       temp[1].splice(temp.indexOf(j),1);
       localStorage.setItem("settings", JSON.stringify(temp));
       document.getElementById("listflow").removeChild(node);
    });

    document.getElementById("listflow").appendChild(node);
}