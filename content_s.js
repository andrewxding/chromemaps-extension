// Mute a singular HTML5 element
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

// Try to mute all video and audio elements on the page
function mutePage() {
    var videos = document.querySelectorAll("video"),
        audios = document.querySelectorAll("audio");

    [].forEach.call(videos, function(video) { muteMe(video); });
    [].forEach.call(audios, function(audio) { muteMe(audio); });
}
mutePage();