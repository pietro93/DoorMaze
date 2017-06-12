var intention, gender, base, shape;

function readSound(sound){
    switch (sound[0]) {
        case "B": 
           base = "beep"
            break;
        case "H":
            base = "human";
            break;
    }
    switch (sound[2]){
        case "B":
            shape = "bottom"
            break;
        case "T":
            shape = "top";
            break;
    }
    switch (sound[3]){
        case "F":
            gender = "female"
            break;
        case "M":
            gender = "male"
            break;
    }
    switch (sound[1]) {
        case "A":
            intention = "approval"
            break;
        case "D":
            intention = "disapproval"
            break;
        case "N":
            intention = "control"
            gender = "neutral"
            shape = "none"
            break;
    }
}

function setPlayer(sound) {
            readSound(sound)
            fileloc = 'sounds/' + sound + '.wav'
            $("#container").append('<center><div id="player" class="player" style="position:absolute; display:none; visibility: hidden;"> </center>')
            $("#player").append('<center><audio id="audio" src="' + fileloc + '" controls/></center>')
            console.log("Playing: " + fileloc)
            console.log("Intention: " + intention + " Gender: " + gender + " Base: " + base + " Shape: " + shape)
}

function stop() {
    $("#player > *").remove()
    $(".player").remove()
    playing = false;
}
