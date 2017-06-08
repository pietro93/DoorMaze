var intention, gender, length, feature;

function readSound(sound){
    switch (sound[0]) {
        case "0": 
           intention = "approval"
            break;
        case "1":
            intention = "disapproval";
            break;
    }
    switch (sound[1]){
        case "0":
            gender = "male"
            break;
        case "1":
            gender = "female";
            break;
    }
    switch (sound[2]){
        case "0":
            sound.length = "short"
            break;
        case "1":
            sound.length = "long";
            break;
    }
    switch (sound[3]){
        case "0":
            sound.feature = "pitch"
            break;
        case "1":
            sound.feature = "intensity"
            break;
        case "2":
            sound.feature = "pitch x intensity";
            break;
    }
}

function setPlayer(sound) {
            readSound(sound)
            fileloc = 'sounds/' + sound + '.wav'
            $("#container").append('<center><div id="player" class="player" style="position:absolute; display:none; visibility: hidden;"> </center>')
            $("#player").append('<center><audio id="audio" src="' + fileloc + '" controls/></center>')
            console.log("Playing: " + fileloc)
            console.log("Intention: " + intention + " Gender: " + gender + " Length: " + length + " Feature: " + feature)
}

function stop() {
    $("#player > *").remove()
    $(".player").remove()
    playing = false;
}
