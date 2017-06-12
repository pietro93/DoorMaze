var ts = Date() // timestamp for output file name
var sounds = []
var score = 0

/* Generates form to ask for participant number, age and gender */
function setDemographics() {
    $("#container").append('<div style="height: 15%"></div>')
    $("#container").append('<fieldset id="demographics">' +
        
        //Participant number
        '<p class="question shadow2"> Participant number:</p>' + 
        '<input type="number" name="pnum" class="question shadow1" style="margin-top: 1%; background-color: black; width: 30%" size="20" value=""></div>' +

        // Gender
        '<div style="margin-top:10%; padding-top: 10%"><p class="question shadow2">Please specify your gender:</p>' +
        '<div><div class="question shadow1" style="float: left"><input type="radio" class="rank" style="height: 24px; width: 24px" id="m" name="gender" value="m" /> Male ♂</div>' +
        '<div class="question shadow1" style="float: center"><input type="radio" class="rank" style="height: 24px; width: 24px" id="f" name="gender" value="f" /> Female ♀</h>' +
        '<div class="question shadow1" style="float: right"><input type="radio" class="rank" style="height: 24px; width: 24px" id="o" name="gender" value="o" /> Other ☿</div></div>' +
        
        // Age
        '<div style="margin-top:10%; padding-top: 10%"><p class="question shadow2"> Please specify your age:</p>' +
        '<input type="number" name="age" class="question shadow1" style="margin-top: 1%; background-color: black; width: 30%" size="20" value=""></div>')
    $("#container").append('<input type="submit" name="next" id="NextButton" value="START" class="nextbutton button" onclick="startGame()"/>')
}

/* Gets value of radio button */
function getRadioValue(form) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements;

    // loop through list of radio buttons
    for (var i = 0; i < 7; i++) {
        if (radios[i].checked) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

/* Stores player info and initialises game */
function startGame() {
    localStorage.clear()
    localStorage.setItem("pnum", $("input[name='pnum']").val())
    localStorage.setItem("gender", getRadioValue(demographics))
    localStorage.setItem("age", $("input[name='age']").val())
    console.log("Participant number: " + localStorage.getItem("pnum") + " Gender:" + localStorage.getItem("gender") + " Age:" + localStorage.getItem("age"));

    //forms must not be null and participant must be at least 18 years old
    if (localStorage.getItem("age") >= 18 && localStorage.getItem("pnum") > 0) { setScreenLayout(null) }
    else { $("#container").append('<div style="margin-top: 3%; position:absolute"><p class="text shadow4"> ⚠ Please insert all the required information. You must be at least 18 years old to proceed. ⚠</p></div>') }
}

/* To assure sounds are played in random order */
function randomiseSounds() {
    // populate array
    for (i = 1; i <= 18; i++) { sounds.push(i) }
    // shuffle array
    sounds.sort(function () {
        return .5 - Math.random();
    });

}

/* To iterate through sounds and end the game when no more sounds available */
function nextSound() {
    if (sounds.length == 0) { complete(); return;; }
    n = sounds.pop();
    next = chooseSound(n)
    return next
}

/* Selects sound corresponding to previously generated random value */
function chooseSound(n) {
    var sound = "";
  
    //  E.g. if n=1 then sound = 0000. Sound format "ABCD" -> A: Base - B: Intention - C: Shape - D: Gender
    if (n <= 9) { sound += "B"} else { sound += "H" };
    if (n <= 4 || (9 <= n && n <= 12)) { sound += "A" } else { sound += "D" };
    if (n <= 2 || (5 <= n && n <= 6) || (9 <= n && n <= 10) || (13 <= n && n <= 14)) { sound += "B" } else { sound += "T" };
    switch (n % 2) {
        case 0:
            sound += "F"; break;
        case 1:
            sound += "M"; break;
      
    }
    if (n == 17) {sound="BN"} else if (n==18) {sound="HN"}
    return sound
    }


/* Updates screen according to player action and current sound */
function setScreenLayout(enterDoor) {
    // empty previous screen
    $("#container > *").fadeOut(1500)
    $("#container").fadeOut(1500)

    setTimeout(function () {
        $("#container > *").remove()
    }, 1600);

    sound = nextSound()

    setTimeout(function () {
        if (enterDoor) { action = "You entered the door and walked until you reached another door." } else { action = "You searched for a different door to enter." }
        door = "door" + Math.floor((Math.random() * 9))

        /* First game screen, introduce scenario */
        if (sounds.length == 17) {
            action = "You are in a maze dungeon with your robot companion. It will guide you outside if you listen to it - every time you approach a door, it will tell you whether you should open it or search for a different one."
        }

        // fill screen
        $("#container").append('<img id="door" src="images/' + door + '.png" style="width: 100%; height: 100%" />')
        $("#container").append('<p class="text shadow2">' + action + '</p>')
        $("#container").append('<p class="text shadow1">Move mouse over door to ask robot for help.</p>')
        $("#container").append('<p class="question shadow2"> Should you enter this door? </p>')
        $("#container").append('<a class="question shadow3" href="#" onclick="submit(true);return false;"> Yes </a>')
        $("#container").append('<a class="question shadow4" href="#" onclick="submit(false);return false;"> No </a>')
        $("#container > *").fadeOut()
        $("#container").fadeIn(1500)
        $("#container > #door").fadeIn(1500)
        $("#container > .text").fadeIn(5000)
        
        // Set sound player according to current sound
        setPlayer(sound);

        // Play sound when players hovers mouse over door
        $(document).ready(function () {
            $("#door").hover(function () {
                audio.play();
                $("#container > .question").fadeIn(4000)
            },
            function () {
                audio.load();
            });
        });
    }, 2000);

}

/* store participant action and update score accordingly */
function submit(enterDoor) {
    readSound(sound)
    localStorage.setItem(sound, + !enterDoor) // stored as 0 = did not enter; 1 = entered
    
    // Increase score if player guessed robot intention correctly
    if ((sound[1] == "A" && enterDoor) || (sound[1] == "D" && !enterDoor))  { score += 1 }
    console.log("Robot feedback: " + intention + " Player entered door: " + enterDoor)
    console.log("Current score: "+score)
    
    // Proceed to new screen
    setScreenLayout(enterDoor)
}


function complete() {

    /*generate CSV file with participant data*/
    csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "P.NUM, GENDER, AGE"
    for (n = 1; n <= 18; n++) {
        csvContent += "," + chooseSound(n)
    }
    csvContent += ",SCORE" + "\n"

    csvContent += localStorage.getItem("pnum") + "," + localStorage.getItem("gender") + "," + localStorage.getItem("age")

    for (n = 1; n <= 18; n++) {
        csvContent += "," + localStorage.getItem(chooseSound(n))
    }

    csvContent += "," + score;

    // Download CSV file
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "P" + localStorage.getItem("pnum") + "_" + ts + ".csv");
   
    link.click();

    // Display final screen and score to participant 
    $("#container > *").fadeOut(1500)
    $("#container").fadeOut(1500)

    setTimeout(function () {
        $("#container > *").remove()
    }, 1600);

    setTimeout(function () {
        action = "You have found your way out of the dungeon."
        $("#container").append('<img id="door" src="images/outside.png" style="width: 100%; height: 100%" />')
        $("#container").append('<p class="score shadow1" style:"position: absolute; top: 25%">' + action + '</p>')
        $("#container").append('<p class="score shadow2"> Your score is <font style="font-weight: bold" color="gold">' + score + '</font> out of 16.</p>')
       
        $("#container").fadeIn(5000)
    }, 2000);

    localStorage.clear()
}