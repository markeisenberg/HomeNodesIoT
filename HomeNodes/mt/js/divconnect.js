var radioActive = false;
var lampActive = false;
var tvActive = false;
var speakerActive = false;
var washActive = false;
var dishActive = false;

var washOn = false;
var dishOn = false;
var lampOn = false;
var speakerOn = false;
var tvOn = false;
var radioOn = false;
var externalOn = false;

var speakerToTV = false;
var lampToRadio = false;
var tvToLamp = false;
var radioToSpeaker = false;
var radioToTV = false;
var speakerToLamp = false;
var externalWToLamp = false;
var externalWToTV = false;
var externalWToRadio = false;
var externalWToSpeaker = false;
var externalDToLamp = false;
var externalDToTV = false;
var externalDToRadio = false;
var externalDToSpeaker = false;


$(document).ready(function () {

    // Declare these variables so you don't have
    // to type the full namespace
    var IOBoard = BO.IOBoard;
    var IOBoardEvent = BO.IOBoardEvent;
    var LED = BO.io.LED;
    var Button = BO.io.Button;
    var ButtonEvent = BO.io.ButtonEvent;
    var pMTProcessor = null;
    var myElement = document.querySelector("#state");

    //startLogic();
    //switchStatus();
    //startNFCListener();
    document.addEventListener("DOMContentLoaded", function (event) {
        plusDivs(0);
    });
     //makes slideshow div active briefly on startup

    // Set to true to print debug messages to console
    BO.enableDebugging = true;

    // If you are not serving this file from the same computer
    // that the Arduino board is connected to, replace
    // window.location.hostname with the IP address or hostname
    // of the computer that the Arduino board is connected to.
    var host = window.location.hostname;
    // if the file is opened locally, set the host to "localhost"
    if (window.location.protocol.indexOf("file:") === 0) {
        host = "localhost";
    }

    var arduino = new IOBoard(host, 8887);

    // Variables
    var led;
    var led2;
    var led3;
    var led4;
    // var button;
    var $state = $('#state');

    // Write the surface properties.
    Surface_PropertiesChanged();

    // Fade the display in.
    $("body").fadeIn();

    // Enable multi-touch.
    pMTProcessor = new KinectTouch({
        debug: true, // Turn on debug points.
        trails: true, // Turn on finger trails (this shows the Kinect data used to detect the finger).
        point_limit: 50, // The number of points we are allowed to process.
        surface_zoffset: 0.045, // The offset from the surface (in meters) at which to start capturing data.
        height: 0.01, // The distance from the surface offset (in meters) at which to stop capturing data.
    });


    // Listen for the IOBoard READY event which indicates the IOBoard
    // is ready to send and receive data
    arduino.addEventListener(IOBoardEvent.READY, onReady);

    function onReady(event) {

        // Remove the event listener because it is no longer needed
        arduino.removeEventListener(IOBoardEvent.READY, onReady);

        // Create an LED object to interface with the LED wired
        // to the I/O board
        led = new LED(arduino, arduino.getDigitalPin(11));
        led2 = new LED(arduino, arduino.getDigitalPin(12));
        led3 = new LED(arduino, arduino.getDigitalPin(13));
        led4 = new LED(arduino, arduino.getDigitalPin(10));

        //Make nodes active   

        $('#washingMachine').bind("touchstart", clickWash);
        $('#dishWasher').bind("touchstart", clickDish);

        $('#leftArrow').bind("touchstart", clickLeft);
        $('#rightArrow').bind("touchstart", clickRight);

        $('#onoff').bind("touchstart", clickSwitch);

        //Confirm deletion
        $('#bin').bind("touchstart", clickBin);
    }

});

function Surface_PropertiesChanged() {
    $("#surf_name").text("" + Surface.Name);
    $("#surf_dims").text("" + round(Surface.Width, 2) + "m x " + round(Surface.Height, 2) + "m");
    $("#surf_angle").text("" + round(Surface.Angle * 57.2957795, 2) + " degrees");
}

/** Called by another display when this one should fade out. */
function startFade(src_name, data) {
    $("body").fadeOut(function () {});
}

function resetAll() {
    document.getElementById("tvNode").style.border = "#d4d4d4";
    document.getElementById("speakerNode").style.border = "#d4d4d4";
    document.getElementById("lampNode").style.border = "#d4d4d4";
    document.getElementById("radioNode").style.border = "#d4d4d4";
    document.getElementById("dishWasher").style.border = "#d4d4d4";
    document.getElementById("washingMachine").style.border = "#d4d4d4";
    lampActive = false;
    tvActive = false;
    speakerActive = false;
    radioActive = false;
    washActive = false;
    dishActive = false;
}

/*  setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
    }, 5000);
    */

function connectSpeaker() {
    document.getElementById("speakerNode").style.border = "thick solid #0000FF";
    speakerActive = true;
    speakerDeletePhase = true;
    checkConnection();
    //turnLedAOn();
}

function connectTV() {
    document.getElementById("tvNode").style.border = "thick solid #0000FF";
    tvActive = true;
    tvDeletePhase = true;
    checkConnection();
    //turnLedAOff();
}

function connectLamp() {
    document.getElementById("lampNode").style.border = "thick solid #0000FF";
    lampActive = true;
    lampDeletePhase = true;
    checkConnection();

}

function connectRadio() {
    document.getElementById("radioNode").style.border = "thick solid #0000FF";
    radioActive = true;
    radioDeletePhase = true;
    checkConnection();

}

function connectWash() {
    //document.getElementById("washingMachine").style.border = "thick solid #0000FF";
    washActive = true;
    checkConnection();

}

function connectDish() {
    //document.getElementById("dishWasher").style.border = "thick solid #0000FF";
    dishActive = true;
    checkConnection();

}

function deleteClicked() {

    if (speakerActive == true && tvActive == true) {
        document.getElementById("speakerTV").style.display = "none";
        speakerToTV = false;
        resetAll();
    }
    if (lampActive == true && radioActive == true) {
        document.getElementById("lampRadio").style.display = "none";
        lampToRadio = false;
        resetAll();
    }
    if (speakerActive == true && lampActive == true) {
        document.getElementById("speakerLamp").style.display = "none";
        speakerToLamp = false;
        resetAll();
    }
    if (tvActive == true && lampActive == true) {
        document.getElementById("tvLamp").style.display = "none";
        tvToLamp = false;
        resetAll();
    }
    if (radioActive == true && speakerActive == true) {
        document.getElementById("radioSpeaker").style.display = "none";
        radioToSpeaker = false;
        resetAll();
    }
    if (radioActive == true && tvActive == true) {
        document.getElementById("radioTV").style.display = "none";
        radioToTV = false;
        resetAll();
    }
    //Dish
    if (dishActive == true && tvActive == true) {
        document.getElementById("externalTVD").style.display = "none";
        externalDToTV = false;
        resetAll();
    }
    if (dishActive == true && speakerActive == true) {
        document.getElementById("externalSpeakerD").style.display = "none";
        externalDToSpeaker = false;
        resetAll();
    }
    if (dishActive == true && lampActive == true) {
        document.getElementById("externalLampD").style.display = "none";
        externalDToLamp = false;
        resetAll();
    }
    if (dishActive == true && radioActive == true) {
        document.getElementById("externalRadioD").style.display = "none";
        externalDToRadio = false;
        resetAll();
    }
    //Washing
    if (washActive == true && tvActive == true) {
        document.getElementById("externalTVW").style.display = "none";
        externalWToTV = false;
        resetAll();
    }
    if (washActive == true && speakerActive == true) {
        document.getElementById("externalSpeakerW").style.display = "none";
        externalWToSpeaker = false;
        resetAll();
    }
    if (washActive == true && lampActive == true) {
        document.getElementById("externalLampW").style.display = "none";
        externalWToLamp = false;
        resetAll();
    }
    if (washActive == true && radioActive == true) {
        document.getElementById("externalRadioW").style.display = "none";
        externalWToRadio = false;
        resetAll();
    }

}

function goRight() {
    plusDivs(1);
    //document.getElementById('btnRightA').click();
}

function goLeft() {
    plusDivs(-1);
    //document.getElementById('btnLeftA').click();
}

function pauseDelete() {
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
        washActive = false;
        dishActive = false;
    }, 5000);
}

function switchExternal() {
    externalOn = !externalOn;
    //check if wash is visible - set to on
    if (externalOn == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
        washOn = true;
        connectedLogic();
    }
    //check if wash is invisible - set to off
    if (externalOn == false && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
        washOn = false;
        connectedLogicOff();
    }

    //check if dish is visible - set to on
    if (externalOn == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
        dishOn = true;
        connectedLogic();
    }
    //check if dish is visible - set to on
    if (externalOn == false && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
        dishOn = false;
        connectedLogicOff();
    }
}

function checkConnection() {
    //Check regulars
    if (radioActive == true && lampActive == true && lampToRadio == false) {
        document.getElementById("lampRadio").style.display = "block";
        lampToRadio = true;
        resetAll();
    }
    if (radioActive == true && lampActive == true && lampToRadio == true) {
        pauseDelete();
    }

    if (radioActive == true && tvActive == true && radioToTV == false) {
        document.getElementById("radioTV").style.display = "block";
        radioToTV = true;
        resetAll();
    }
    if (radioActive == true && tvActive == true && radioToTV == true) {
        pauseDelete();
    }

    if (radioActive == true && speakerActive == true && radioToSpeaker == false) {
        document.getElementById("radioSpeaker").style.display = "block";
        radioToSpeaker = true;
        resetAll();
    }
    if (radioActive == true && speakerActive == true && radioToSpeaker == true) {
        pauseDelete();
    }

    if (tvActive == true && speakerActive == true && speakerToTV == false) {
        document.getElementById("speakerTV").style.display = "block";
        speakerToTV = true;
        resetAll();
    }
    if (tvActive == true && speakerActive == true && speakerToTV == true) {
        pauseDelete();
    }

    if (tvActive == true && lampActive == true && tvToLamp == false) {
        document.getElementById("tvLamp").style.display = "block";
        tvToLamp = true;
        resetAll();
    }
    if (tvActive == true && lampActive == true && tvToLamp == true) {
        pauseDelete();
    }

    if (speakerActive == true && lampActive == true && speakerToLamp == false) {
        document.getElementById("speakerLamp").style.display = "block";
        speakerToLamp = true;
        resetAll();
    }
    if (speakerActive == true && lampActive == true && speakerToLamp == true) {
        pauseDelete();
    }

    //Check external wash
    if (speakerActive == true && washActive == true && externalWToSpeaker == false) {
        document.getElementById("externalSpeakerW").style.display = "block";
        externalWToSpeaker = true;
        resetAll();
    }
    if (speakerActive == true && washActive == true && externalWToSpeaker == true) {
        pauseDelete();
    }

    if (tvActive == true && washActive == true && externalWToTV == false) {
        document.getElementById("externalTVW").style.display = "block";
        externalWToTV = true;
        resetAll();
    }
    if (tvActive == true && washActive == true && externalWToTV == true) {
        pauseDelete();
    }

    if (radioActive == true && washActive == true && externalWToRadio == false) {
        document.getElementById("externalRadioW").style.display = "block";
        externalWToRadio = true;
        resetAll();
    }
    if (radioActive == true && washActive == true && externalWToRadio == true) {
        pauseDelete();
    }

    if (lampActive == true && washActive == true && externalWToLamp == false) {
        document.getElementById("externalLampW").style.display = "block";
        externalWToLamp = true;
        resetAll();
    }
    if (lampActive == true && washActive == true && externalWToLamp == true) {
        pauseDelete();
    }

    //Check external dish
    if (speakerActive == true && dishActive == true && externalDToSpeaker == false) {
        document.getElementById("externalSpeakerD").style.display = "block";
        externalDToSpeaker = true;
        resetAll();
    }
    if (speakerActive == true && dishActive == true && externalDToSpeaker == true) {
        pauseDelete();
    }

    if (tvActive == true && dishActive == true && externalDToTV == false) {
        document.getElementById("externalTVD").style.display = "block";
        externalDToTV = true;
        resetAll();
    }
    if (tvActive == true && dishActive == true && externalDToTV == true) {
        pauseDelete();
    }

    if (radioActive == true && dishActive == true && externalDToRadio == false) {
        document.getElementById("externalRadioD").style.display = "block";
        externalDToRadio = true;
        resetAll();
    }
    if (radioActive == true && dishActive == true && externalDToRadio == true) {
        pauseDelete();
    }

    if (lampActive == true && dishActive == true && externalDToLamp == false) {
        document.getElementById("externalLampD").style.display = "block";
        externalDToLamp = true;
        resetAll();
    }
    if (lampActive == true && dishActive == true && externalDToLamp == true) {
        pauseDelete();
    }

}

function switchStatus() {
    //TV
    if (tvOn == true) {
        document.getElementById("tvNode").style.backgroundColor = "green";
        document.getElementById("tvNode").innerHTML = "On";
    }
    if (tvOn == false) {
        document.getElementById("tvNode").style.backgroundColor = "red";
        document.getElementById("tvNode").innerHTML = "Off";
    }
    //SPEAKER
    if (speakerOn == true) {
        document.getElementById("speakerNode").style.backgroundColor = "green";
        document.getElementById("speakerNode").innerHTML = "On";
    }
    if (speakerOn == false) {
        document.getElementById("speakerNode").style.backgroundColor = "red";
        document.getElementById("speakerNode").innerHTML = "Off";
    }
    //LAMP
    if (lampOn == true) {
        document.getElementById("lampNode").style.backgroundColor = "green";
        document.getElementById("lampNode").innerHTML = "On";
    }
    if (lampOn == false) {
        document.getElementById("lampNode").style.backgroundColor = "red";
        document.getElementById("lampNode").innerHTML = "Off";
    }
    //RADIO
    if (radioOn == true) {
        document.getElementById("radioNode").style.backgroundColor = "green";
        document.getElementById("radioNode").innerHTML = "On";
    }
    if (radioOn == false) {
        document.getElementById("radioNode").style.backgroundColor = "red";
        document.getElementById("radioNode").innerHTML = "Off";
    }
}

//SLIDESHOW
var slideIndex = 1;
document.addEventListener("DOMContentLoaded", function (event) {
    showDivs(slideIndex);
});

function plusDivs(n) {
    showDivs(slideIndex += n);

    //Changing on/off state of external when slide changes
    if (washOn == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
    }
    if (washOn == false && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
    }
    if (dishOn == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
    }
    if (dishOn == false && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
    }

    //Changing state of external connections when slide changes
    //LAMP ---- W
    if (externalWToLamp == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("externalLampW").style.display = "block";
    }
    if (document.getElementById("washingMachine").style.display == "none") {
        document.getElementById("externalLampW").style.display = "none";
    }

    //RADIO ---- W
    if (externalWToRadio == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("externalRadioW").style.display = "block";
    }
    if (document.getElementById("washingMachine").style.display == "none") {
        document.getElementById("externalRadioW").style.display = "none";
    }

    //TV ---- W
    if (externalWToTV == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("externalTVW").style.display = "block";
    }
    if (document.getElementById("washingMachine").style.display == "none") {
        document.getElementById("externalTVW").style.display = "none";
    }

    //SPEAKER ---- W
    if (externalWToSpeaker == true && document.getElementById("washingMachine").style.display == "block") {
        document.getElementById("externalSpeakerW").style.display = "block";
    }
    if (document.getElementById("washingMachine").style.display == "none") {
        document.getElementById("externalSpeakerW").style.display = "none";
    }



    //LAMP ---- D
    if (externalDToLamp == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("externalLampD").style.display = "block";
    }
    if (document.getElementById("dishWasher").style.display == "none") {
        document.getElementById("externalLampD").style.display = "none";
    }

    //RADIO ---- D
    if (externalDToRadio == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("externalRadioD").style.display = "block";
    }
    if (document.getElementById("dishWasher").style.display == "none") {
        document.getElementById("externalRadioD").style.display = "none";
    }

    //TV ---- D
    if (externalDToTV == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("externalTVD").style.display = "block";
    }
    if (document.getElementById("dishWasher").style.display == "none") {
        document.getElementById("externalTVD").style.display = "none";
    }

    //SPEAKER ---- D
    if (externalDToSpeaker == true && document.getElementById("dishWasher").style.display == "block") {
        document.getElementById("externalSpeakerD").style.display = "block";
    }
    if (document.getElementById("dishWasher").style.display == "none") {
        document.getElementById("externalSpeakerD").style.display = "none";
    }

}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.display = "block";
}
//END SLIDES


/**
 * setup Function that connect to spacebrew and creates a listener for clicks of the submit button.
 */
function setup() {
    var random_id = "0000" + Math.floor(Math.random() * 10000);

    app_name = app_name + ' ' + random_id.substring(random_id.length - 4);

    // setup spacebrew
    sb = new Spacebrew.Client(); // create spacebrew client object

    sb.name(app_name);
    sb.description("This app sends the NFC string data from Processing to Spacebrew JS"); // set the app description

    // create the spacebrew subscription channels
    sb.addPublish("text", "string", ""); // create the publication feed
    sb.addSubscribe("text", "string"); // create the subscription feed

    // configure the publication and subscription feeds
    sb.onStringMessage = onStringMessage;
    sb.onOpen = onOpen;

    // connect to spacbrew
    sb.connect();

    // listen to button clicks
    //$("#button").on("mousedown", onMouseDown);
}

/**
 * Function that is called when Spacebrew connection is established
 */
function onOpen() {
    var message = "Connected as <strong>" + sb.name() + "</strong>. ";
    if (sb.name() === app_name) {
        message += "<br>You can customize this app's name in the query string by adding <strong>name=your_app_name</strong>."
    }
    $("#name").html(message);
}


/**
 * onStringMessage Function that is called whenever new spacebrew string messages are received.
 *          It accepts two parameters:
 * @param  {String} name    Holds name of the subscription feed channel
 * @param  {String} value 	Holds value received from the subscription feed
 */
function onStringMessage(name, value) {
    console.log("[onBooleanMessage] boolean message received ", value);
    $("#msg_received").text(value); // display the sent message in the browser  
    //do something
}




function washTouch() {
    document.getElementById("washingMachine").style.border = "thick solid #0000FF";
    connectWash();
    setTimeout(function () {
        document.getElementById("washingMachine").style.border = "#d4d4d4";
    }, 5000);

}

function dishTouch() {
    document.getElementById("dishWasher").style.border = "thick solid #0000FF";
    connectDish();
    setTimeout(function () {
        document.getElementById("dishWasher").style.border = "#d4d4d4";
    }, 5000);

}


function washClick() {
    document.getElementById("washingMachine").style.border = "thick solid #0000FF";
    connectWash();
    setTimeout(function () {
        document.getElementById("washingMachine").style.border = "#d4d4d4";
    }, 5000);

}

function dishClick() {
    document.getElementById("dishWasher").style.border = "thick solid #0000FF";
    connectDish();
    setTimeout(function () {
        document.getElementById("dishWasher").style.border = "#d4d4d4";
    }, 5000);

}

function clickWash() {
    newValue = "Wash";
    sendMessageToPeer('c2');
    washClick();
}

function clickDish() {
    newValue = "Dish";
    sendMessageToPeer('c2');
    dishClick();
}

function clickRight() {
    newValue = "Right";
    sendMessageToPeer('c2');
    goRight();
}

function clickLeft() {
    newValue = "Left";
    sendMessageToPeer('c2');
    goLeft();
}

function clickSwitch() {
    newValue = "Switch";
    sendMessageToPeer('c2');
    switchExternal();
}

function clickBin() {
    newValue = "Bin";
    sendMessageToPeer('c2');
    deleteClicked();
    document.getElementById("bin").src = "images/binFilled.png";

    setTimeout(function () {
        document.getElementById("bin").src = "images/binClosedExtend.png";
    }, 1000);
}

function switchVFromNFC(){
    newValue = "SwitchNFC";
    sendMessageToPeer('c1');
    switchExternal();
}



//LOGIC
function connectedAOn() {
    speakerOn = true;
    switchStatus();
    connectedLogic();
}

function connectedAOff() {
    speakerOn = false;
    switchStatus();
    connectedLogicOff();
}

function connectedBOn() {
    tvOn = true;
    switchStatus();
    connectedLogic();
}

function connectedBOff() {
    tvOn = false;
    switchStatus();
    connectedLogicOff();
}

function connectedCOn() {
    lampOn = true;
    switchStatus();
    connectedLogic();
}

function connectedCOff() {
    lampOn = false;
    switchStatus();
    connectedLogicOff();
}

function connectedDOn() {
    radioOn = true;
    switchStatus();
    connectedLogic();
}

function connectedDOff() {
    radioOn = false;
    switchStatus();
    connectedLogicOff();
}


function connectedLogic() {

    //Connected Logic ****
    //RED LOGIC
    if (speakerToTV == true && tvOn == false && speakerOn == true) {
        document.getElementById('btnRightB').click();
    }
    if (speakerToTV == true && tvOn == true && speakerOn == false) {
        document.getElementById('btnRightA').click();
    }

    //YELLOW LOGIC
    if (tvToLamp == true && tvOn == false && lampOn == true) {
        document.getElementById('btnRightB').click();
    }
    if (tvToLamp == true && tvOn == true && lampOn == false) {
        document.getElementById('btnRightC').click();
    }

    //GREENB LOGIC
    if (radioToSpeaker == true && speakerOn == false && radioOn == true) {
        document.getElementById('btnRightA').click();
    }
    if (radioToSpeaker == true && speakerOn == true && radioOn == false) {
        document.getElementById('btnRightD').click();
    }

    //BLUE LOGIC
    if (lampToRadio == true && lampOn == false && radioOn == true) {
        document.getElementById('btnRightC').click();
    }
    if (lampToRadio == true && lampOn == true && radioOn == false) {
        document.getElementById('btnRightD').click();
    }

    //ORANGE LOGIC
    if (speakerToLamp == true && lampOn == false && speakerOn == true) {
        document.getElementById('btnRightC').click();
    }
    if (speakerToLamp == true && lampOn == true && speakerOn == false) {
        document.getElementById('btnRightA').click();
    }

    //PINK LOGIC
    if (radioToTV == true && tvOn == false && radioOn == true) {
        document.getElementById('btnRightB').click();
    }
    if (radioToTV == true && tvOn == true && radioOn == false) {
        document.getElementById('btnRightD').click();
    }

    //**EXT WASH **//       
    //LAMPEXTW LOGIC
    if (externalWToLamp == true && lampOn == false && washOn == true) {
        //switchExternal();
        document.getElementById('btnRightC').click();
    }
    if (externalWToLamp == true && lampOn == true && washOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //TVEXTW LOGIC
    if (externalWToTV == true && tvOn == false && washOn == true) {
        //switchExternal();
        document.getElementById('btnRightB').click();
    }
    if (externalWToTV == true && tvOn == true && washOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //RADIOEXTW LOGIC
    if (externalWToRadio == true && radioOn == false && washOn == true) {
        //switchExternal();
        document.getElementById('btnRightD').click();
    }
    if (externalWToRadio == true && radioOn == true && washOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //SPEAKEREXTW LOGIC
    if (externalWToSpeaker == true && speakerOn == false && washOn == true) {
        switchExternal();
        document.getElementById('btnRightA').click();
    }
    if (externalWToSpeaker == true && speakerOn == true && washOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //**EXT DISH ** //
    //LAMPEXTD LOGIC
    if (externalDToLamp == true && lampOn == false && dishOn == true) {
        //switchExternal();
        document.getElementById('btnRightC').click();
    }
    if (externalDToLamp == true && lampOn == true && dishOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //TVEXTD LOGIC
    if (externalDToTV == true && tvOn == false && dishOn == true) {
        //switchExternal();
        document.getElementById('btnRightB').click();
    }
    if (externalDToTV == true && tvOn == true && dishOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //RADIOEXTD LOGIC
    if (externalDToRadio == true && radioOn == false && dishOn == true) {
        //switchExternal();
        document.getElementById('btnRightD').click();
    }
    if (externalDToRadio == true && radioOn == true && dishOn == false) {
        switchExternal();
        //clickSwitch();
    }

    //SPEAKEREXTD LOGIC
    if (externalDToSpeaker == true && speakerOn == false && washOn == true) {
        //switchExternal();
        document.getElementById('btnRightA').click();
    }
    if (externalDToSpeaker == true && speakerOn == true && washOn == false) {
        switchExternal();
        //clickSwitch();
    }
}

function connectedLogicOff() {
    //RED
    if (speakerToTV == true && tvOn == false && speakerOn == true) {
        document.getElementById('btnLeftA').click();
    }
    if (speakerToTV == true && tvOn == true && speakerOn == false) {
        document.getElementById('btnLeftB').click();
    }

    //YELLOW
    if (tvToLamp == true && tvOn == false && lampOn == true) {
        document.getElementById('btnLeftC').click();
    }
    if (tvToLamp == true && tvOn == true && lampOn == false) {
        document.getElementById('btnLeftB').click();
    }

    //GREENB
    if (radioToSpeaker == true && speakerOn == false && radioOn == true) {
        document.getElementById('btnLeftD').click();
    }
    if (radioToSpeaker == true && speakerOn == true && radioOn == false) {
        document.getElementById('btnLeftA').click();
    }

    //BLUE LOGIC
    if (lampToRadio == true && lampOn == false && radioOn == true) {
        document.getElementById('btnLeftC').click();
    }
    if (lampToRadio == true && lampOn == true && radioOn == false) {
        document.getElementById('btnLeftD').click();
    }

    //ORANGE LOGIC
    if (speakerToLamp == true && lampOn == false && speakerOn == true) {
        document.getElementById('btnLeftA').click();
    }
    if (speakerToLamp == true && lampOn == true && speakerOn == false) {
        document.getElementById('btnLeftC').click();
    }

    //PINK LOGIC
    if (radioToTV == true && tvOn == false && radioOn == true) {
        document.getElementById('btnLeftD').click();
    }
    if (radioToTV == true && tvOn == true && radioOn == false) {
        document.getElementById('btnLeftB').click();
    }


    //**EXT WASH **//       
    //LAMPEXTW LOGIC
    if (externalWToLamp == true && lampOn == false && washOn == true) {
        switchExternal();
        //clickSwitch();
    }
    if (externalWToLamp == true && lampOn == true && washOn == false) {
        document.getElementById('btnLeftC').click();
    }

    //TVEXTW LOGIC
    if (externalWToTV == true && tvOn == false && washOn == true) {
         switchExternal();
         //clickSwitch();
    }
    if (externalWToTV == true && tvOn == true && washOn == false) {
        document.getElementById('btnLeftB').click();
    }

    //RADIOEXTW LOGIC
    if (externalWToRadio == true && radioOn == false && washOn == true) {
        switchExternal();
        //clickSwitch();
        
    }
    if (externalWToRadio == true && radioOn == true && washOn == false) {
       document.getElementById('btnLeftD').click();
    }

    //SPEAKEREXTW LOGIC
    if (externalWToSpeaker == true && speakerOn == false && washOn == true) {
        switchExternal();
        //clickSwitch();
        
    }
    if (externalWToSpeaker == true && speakerOn == true && washOn == false) {
        document.getElementById('btnLeftA').click();
    }


    //**EXT DISH ** //
    //LAMPEXTD LOGIC
    if (externalDToLamp == true && lampOn == false && dishOn == true) {
        switchExternal();
        //clickSwitch();
        
    }
    if (externalDToLamp == true && lampOn == true && dishOn == false) {
        document.getElementById('btnLeftC').click();
    }

    //TVEXTD LOGIC
    if (externalDToTV == true && tvOn == false && dishOn == true) {
        //switchExternal();
        switchExternal();
        //clickSwitch();
        
    }
    if (externalDToTV == true && tvOn == true && dishOn == false) {
        document.getElementById('btnLeftB').click();
    }

    //RADIOEXTD LOGIC
    if (externalDToRadio == true && radioOn == false && dishOn == true) {
        //switchExternal();
        switchExternal();
        //clickSwitch();
       
    }
    if (externalDToRadio == true && radioOn == true && dishOn == false) {
        document.getElementById('btnLeftD').click();
    }

    //SPEAKEREXTD LOGIC
    if (externalDToSpeaker == true && speakerOn == false && washOn == true) {
        //switchExternal();
        switchExternal();
        //clickSwitch();
        
    }
    if (externalDToSpeaker == true && speakerOn == true && washOn == false) {  
        document.getElementById('btnLeftA').click();
    }
}
