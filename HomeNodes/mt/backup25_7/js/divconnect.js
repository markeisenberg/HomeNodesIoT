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
    
    //startProtobject();
    //startNFCListener();
    plusDivs(0); //makes slideshow div active briefly on startup

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

    // attach fastclick to avoid 300ms click delay on mobile devices
    FastClick.attach(document.body);

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
        point_limit: 200, // The number of points we are allowed to process.
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

        // Create a new Button object to interface with the physical
        // button wired to the I/O board
  //      button = new Button(arduino, arduino.getDigitalPin(2));

        // Listen for button press and release events
   //     button.addEventListener(ButtonEvent.PRESS, onPress);
  //      button.addEventListener(ButtonEvent.RELEASE, onRelease);

        // Use jQuery to get a reference to the buttons
        // and listen for click events
        
        //Make nodes active    
        $('#washingMachine').bind("touchstart", clickWash);
        $('#dishWasher').bind("touchstart", clickDish);
        
        $('#leftArrow').bind("touchstart", clickLeft);
        $('#rightArrow').bind("touchstart", clickRight);
        
        $('#onoff').bind("touchstart", clickSwitch);

        //Confirm deletion
        $('#bin').bind("touchstart", clickBin);
    }

      function onPress(evt) {
        // Get a reference to the target which is the button that
        // triggered the event
        var btn = evt.target;
        // Display the state on the page
        $state.html("Button " + btn.pinNumber + " state: Pressed");
    }

    function onRelease(evt) {
        // Get a reference to the target which is the button that
        // triggered the event
        var btn = evt.target;
        // Display the state on the page
        $state.html("Button " + btn.pinNumber + " state: Released");
    } 

    function turnLedAOn(evt) {
      // Turn the LED on
      led.on();
    }

    function turnLedAOff(evt) {
      // Turn the LED off
      led.off();
    }

    function turnLedBOn(evt) {
      // Turn the LED2 on
      led2.on();
    }

    function turnLedBOff(evt) {
      // Turn the LED2 off
      led2.off();
    }

    function turnLedCOn(evt) {
      // Turn the LED3 on
      led3.on();
    }

    function turnLedCOff(evt) {
      // Turn the LED3 off
      led3.off();
    }
    function turnLedDOn(evt) {
      // Turn the LED4 on
      led4.on();
    }

    function turnLedDOff(evt) {
      // Turn the LED4 off
      led4.off();
    }

    //PROTOBJECT CODE
    function startProtobject() {
        protobject.connect("ws://localhost:8085/"); //Protobject WebSocket connection

        protobject.loop(function () {
            if (protobject.getState("Lamp") == "Lamp-off") {
                console.log("Lamp off");
                lampOn = false;
            }
            if (protobject.getState("Lamp") == "Lamp-on") {
                console.log("Lamp on");
                lampOn = true;
            }
            if (protobject.getState("Speaker") == "Speaker-off") {
                console.log("Speaker off");
                speakerOn = false;
            }
            if (protobject.getState("Speaker") == "Speaker-on") {
                console.log("Speaker on");
                speakerOn = true;
            }
            if (protobject.getState("TV") == "TV-off") {
                console.log("TV off");
                tvOn = false;
            }
            if (protobject.getState("TV") == "TV-on") {
                console.log("TV on");
                tvOn = true;
            }
            if (protobject.getState("Radio") == "Radio-off") {
                console.log("Radio off");
                speakerOn = false;
            }
            if (protobject.getState("Radio") == "Radio-on") {
                console.log("Radio on");
                radioOn = true;
            }
            if (protobject.getState("External") == "External-off") {
                console.log("External off");
                externalOn = false;
            }
            if (protobject.getState("External") == "External-on") {
                console.log("External on");
                externalOn = true;
            }
            
            //Connected Logic ****
            //RED LOGIC
            if (speakerToTV == true && tvOn == true && speakerOn == true) {
                    turnLedAOn();
                    turnLedBOn();
                }
            if (speakerToTV == true && tvOn == false && speakerOn == true) {
                    turnLedAOn();
                    turnLedBOn();
                }
            if (speakerToTV == true && tvOn == true && speakerOn == false) {
                    turnLedAOn();
                    turnLedBOn();
                }
            if (speakerToTV == false && tvOn == true && speakerOn == false) {
                    turnLedBOn();
                }
            if (speakerToTV == false && tvOn == false && speakerOn == true) {
                    turnLedAOn();
                }
            
            //YELLOW LOGIC
            if (tvToLamp == true && tvOn == true && lampOn == true) {
                    turnLedBOn();
                    turnLedCOn();
                }
            if (tvToLamp == true && tvOn == false && lampOn == true) {
                    turnLedBOn();
                    turnLedCOn();
                }
            if (tvToLamp == true && tvOn == true && lampOn == false) {
                    turnLedBOn();
                    turnLedCOn();
                }
            if (tvToLamp == false && tvOn == true && lampOn == false) {
                    turnLedBOn();
                }
            if (tvToLamp == false && tvOn == false && lampOn == true) {
                    turnLedCOn();
                }
            
            //GREENB LOGIC
            if (radioToSpeaker == true && speakerOn == true && radioOn == true) {
                    turnLedAOn();
                    turnLedDOn();
                }
            if (radioToSpeaker == true && speakerOn == false && radioOn == true) {
                    turnLedAOn();
                    turnLedDOn();
                }
            if (radioToSpeaker == true && speakerOn == true && radioOn == false) {
                    turnLedAOn();
                    turnLedDOn();
                }
            if (radioToSpeaker == false && radioOn == true && speakerOn == false) {
                    turnLedDOn();
                }
            if (radioToSpeaker == false && radioOn == false && speakerOn == true) {
                    turnLedAOn();
                }
            
            //BLUE LOGIC
            if (lampToRadio == true && lampOn == true && radioOn == true) {
                    turnLedDOn();
                    turnLedCOn();
                }
            if (lampToRadio == true && lampOn == false && radioOn == true) {
                    turnLedDOn();
                    turnLedCOn();
                }
            if (lampToRadio == true && lampOn == true && radioOn == false) {
                    turnLedDOn();
                    turnLedCOn();
                }
            if (lampToRadio == false && radioOn == true && lampOn == false) {
                    turnLedDOn();
                }
            if (lampToRadio == false && radioOn == false && lampOn == true) {
                    turnLedCOn();
                }
     //**EXT WASH **//       
            //LAMPEXTW LOGIC
            if (externalWToLamp == true && lampOn == true && washOn == true) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalWToLamp == true && lampOn == false && washOn == true) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalWToLamp == true && lampOn == true && washOn == false) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalWToLamp == false && lampOn == true && washOn == false) {
                    turnLedCOn();
                }
            if (lampToRadio == false && lampOn == false && washOn == true) {
                    switchExternal();
                }
            
            //TVEXTW LOGIC
            if (externalWToTV == true && tvOn == true && washOn == true) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalWToTV == true && tvOn == false && washOn == true) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalWToTV == true && tvOn == true && washOn == false) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalWToTV == false && tvOn == true && washOn == false) {
                    turnLedBOn();
                }
            if (externalWToTV == false && tvOn == false && washOn == true) {
                    switchExternal();
                }
            
            //RADIOEXTW LOGIC
            if (externalWToRadio == true && radioOn == true && washOn == true) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalWToRadio == true && radioOn == false && washOn == true) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalWToRadio == true && radioOn == true && washOn == false) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalWToRadio == true && radioOn == true && washOn == true) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalWToRadio == false && radioOn == true && washOn == false) {
                    turnLedDOn();
                }
            if (externalWToRadio == false && radioOn == false && washOn == true) {
                    switchExternal();
                }
            
            //SPEAKEREXTW LOGIC
            if (externalWToSpeaker == true && speakerOn == true && washOn == true) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalWToSpeaker == true && speakerOn == false && washOn == true) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalWToSpeaker == true && speakerOn == true && washOn == false) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalWToSpeaker == false && speakerOn == true && washOn == false) {
                    turnLedAOn();
                }
            if (externalWToSpeaker == false && speakerOn == false && washOn == true) {
                    switchExternal();
                }
        //**EXT DISH ** //
            
            //LAMPEXTD LOGIC
            if (externalDToLamp == true && lampOn == true && dishOn == true) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalDToLamp == true && lampOn == false && dishOn == true) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalDToLamp == true && lampOn == true && dishOn == false) {
                    switchExternal();
                    turnLedCOn();
                }
            if (externalDToLamp == false && lampOn == true && dishOn == false) {
                    turnLedCOn();
                }
            if (externalDToLamp == false && lampOn == false && dishOn == true) {
                    switchExternal();
                }
            
            //TVEXTD LOGIC
            if (externalDToTV == true && tvOn == true && dishOn == true) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalDToTV == true && tvOn == false && dishOn == true) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalDToTV == true && tvOn == true && dishOn == false) {
                    switchExternal();
                    turnLedBOn();
                }
            if (externalDToTV == false && tvOn == true && dishOn == false) {
                    turnLedBOn();
                }
            if (externalDToTV == false && tvOn == false && dishOn == true) {
                    switchExternal();
                }
            
            //RADIOEXTD LOGIC
            if (externalDToRadio == true && radioOn == true && dishOn == true) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalDToRadio == true && radioOn == false && dishOn == true) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalDToRadio == true && radioOn == true && dishOn == false) {
                    switchExternal();
                    turnLedDOn();
                }
            if (externalDToRadio == false && radioOn == true && dishOn == false) {
                    turnLedDOn();
                }
            if (externalDToRadio == false && radioOn == false && dishOn == true) {
                    switchExternal();
                }
            
            //SPEAKEREXTD LOGIC
            if (externalDToSpeaker == true && speakerOn == true && washOn == true) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalDToSpeaker == true && speakerOn == false && washOn == true) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalDToSpeaker == true && speakerOn == true && washOn == false) {
                    switchExternal();
                    turnLedAOn();
                }
            if (externalDToSpeaker == false && speakerOn == true && dishOn == false) {
                    turnLedAOn();
                }
            if (externalDToSpeaker == false && speakerOn == false && dishOn == true) {
                    switchExternal();
                }
            
        });
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

function message_broadcast(message)
{
    localStorage.setItem('message',JSON.stringify(message));
    localStorage.removeItem('message');
}


// receive message
//
function message_receive(ev)
{
    if (ev.originalEvent.key!='message') return; // ignore other keys
    var message=JSON.parse(ev.originalEvent.newValue);
    if (!message) return; // ignore empty msg or msg reset

    // here you act on messages.
    // you can send objects like { 'command': 'doit', 'data': 'abcd' }
    if (message.command == 'doit') alert(message.data);

    // etc.
}

function connectSpeaker() {
    document.getElementById("speakerNode").style.border = "thick solid #0000FF";
    speakerActive = true;
    speakerDeletePhase = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
    }, 3000);
}

function connectTV() {
    document.getElementById("tvNode").style.border = "thick solid #0000FF";
    tvActive = true;
    tvDeletePhase = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
    }, 3000);
}

function connectLamp() {
    document.getElementById("lampNode").style.border = "thick solid #0000FF";
    lampActive = true;
    lampDeletePhase = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
    }, 3000);
}

function connectRadio() {
    document.getElementById("radioNode").style.border = "thick solid #0000FF";
    radioActive = true;
    radioDeletePhase = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
    }, 3000);
}

function connectWash() {
    //document.getElementById("washingMachine").style.border = "thick solid #0000FF";
    washActive = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        //document.getElementById("washingMachine").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
        washActive = false;
    }, 3000);
}

function connectDish() {
    //document.getElementById("dishWasher").style.border = "thick solid #0000FF";
    dishActive = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        //document.getElementById("dishWasher").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
        dishActive = false;
    }, 3000);
}

function deleteClicked() {

    if (speakerActive == true && tvActive == true) {
        document.getElementById("speakerTV").style.display = "none";
        speakerToTV = false;
    }
    if (lampActive == true && radioActive == true) {
        document.getElementById("lampRadio").style.display = "none";
        lampToRadio = false;
    }
    if (speakerActive == true && lampActive == true) {
        document.getElementById("speakerLamp").style.display = "none";
        speakerToLamp = false;
    }
    if (tvActive == true && lampActive == true) {
        document.getElementById("tvLamp").style.display = "none";
        tvToLamp = false;
    }
    if (radioActive == true && speakerActive == true) {
        document.getElementById("radioSpeaker").style.display = "none";
        radioToSpeaker = false;
    }
    if (radioActive == true && tvActive == true) {
        document.getElementById("radioTV").style.display = "none";
        radioToTV = false;
    }
    //Dish
    if (dishActive == true && tvActive == true) {
        document.getElementById("externalTV").style.display = "none";
        externalDToTV = false;
    }
    if (dishActive == true && speakerActive == true) {
        document.getElementById("externalSpeaker").style.display = "none";
        externalDToSpeaker = false;
    }
    if (dishActive == true && lampActive == true) {
        document.getElementById("externalLamp").style.display = "none";
        externalDToLamp = false;
    }
    if (dishActive == true && radioActive == true) {
        document.getElementById("externalRadio").style.display = "none";
        externalDToRadio = false;
    }
    //Washing
    if (washActive == true && tvActive == true) {
        document.getElementById("externalTV").style.display = "none";
        externalWToTV = false;
    }
    if (washActive == true && speakerActive == true) {
        document.getElementById("externalSpeaker").style.display = "none";
        externalWToSpeaker = false;
    }
    if (washActive == true && lampDeletePhase == true) {
        document.getElementById("externalLamp").style.display = "none";
        externalWToLamp = false;
    }
    if (washActive == true && radioDeletePhase == true) {
        document.getElementById("externalRadio").style.display = "none";
        externalWToRadio = false;
    }

}

function goRight(){
    plusDivs(1);
}

function goLeft(){
    plusDivs(-1);
}

function switchExternal(){
    externalOn = !externalOn;
    //check if wash is visible - set to on
    if (externalOn == true && document.getElementById("washingMachine").style.display == "block"){
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
        washOn = true; 
    }
    //check if wash is invisible - set to off
    if (externalOn == false && document.getElementById("washingMachine").style.display == "block"){
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
        washOn = false;
    }
    
    if (externalOn == true && document.getElementById("dishWasher").style.display == "block"){
        document.getElementById("onoff").style.backgroundColor = "green";
        document.getElementById("onoff").innerHTML = "On";
        dishOn = true; 
    }
    if (externalOn == false && document.getElementById("dishWasher").style.display == "block"){
        document.getElementById("onoff").style.backgroundColor = "red";
        document.getElementById("onoff").innerHTML = "Off";
        dishOn = false; 
    }
}

function checkConnection() {
    //Check regulars
    if (radioActive == true && lampActive == true) {
        document.getElementById("lampRadio").style.display = "block";
        lampToRadio = true;
    }
    if (radioActive == true && tvActive == true) {
        document.getElementById("radioTV").style.display = "block";
        radioToTV = true;
    }
    if (radioActive == true && speakerActive == true) {
        document.getElementById("radioSpeaker").style.display = "block";
        radioToSpeaker = true;
    }
    if (tvActive == true && speakerActive == true) {
        document.getElementById("speakerTV").style.display = "block";
        speakerToTV = true;
    }
    if (tvActive == true && lampActive == true) {
        document.getElementById("tvLamp").style.display = "block";
        tvToLamp = true;
    }
    if (speakerActive == true && lampActive == true) {
        document.getElementById("speakerLamp").style.display = "block"; 
        speakerToLamp = true;
    }
    //Check external wash
    if (speakerActive == true && washActive == true) {
        document.getElementById("externalSpeaker").style.display = "block";
        externalWToSpeaker = true;
    }
    if (tvActive == true && washActive == true) {
        document.getElementById("externalTV").style.display = "block";
        externalWToTV = true;
    }
    if (radioActive == true && washActive == true) {
        document.getElementById("externalRadio").style.display = "block";
        externalWToRadio = true;
    }
    if (lampActive == true && washActive == true) {
        document.getElementById("externalLamp").style.display = "block";
        externalWToLamp = true;
    }
    //Check external dish
    if (speakerActive == true && dishActive == true) {
        document.getElementById("externalSpeaker").style.display = "block";
        externalDToSpeaker = true;
    }
    if (tvActive == true && dishActive == true) {
        document.getElementById("externalTV").style.display = "block";
        externalDToTV = true;
    }
    if (radioActive == true && dishActive == true) {
        document.getElementById("externalRadio").style.display = "block";
        externalDToRadio = true;
    }
    if (lampActive == true && dishActive == true) {
        document.getElementById("externalLamp").style.display = "block";
        externalDToLamp = true;
    }
}

//SLIDESHOW
    var slideIndex = 1;
        showDivs(slideIndex);

        function plusDivs(n) {
            showDivs(slideIndex += n);
            
            //Changing on/off state of external when slide changes
            if (washOn == true && document.getElementById("washingMachine").style.display == "block"){
                document.getElementById("onoff").style.backgroundColor = "green";
                document.getElementById("onoff").innerHTML = "On";
            }
            if (washOn == false && document.getElementById("washingMachine").style.display == "block"){
                document.getElementById("onoff").style.backgroundColor = "red";
                document.getElementById("onoff").innerHTML = "Off";
            }
            if (dishOn == true && document.getElementById("dishWasher").style.display == "block"){
                document.getElementById("onoff").style.backgroundColor = "green";
                document.getElementById("onoff").innerHTML = "On";
            }
            if (dishOn == false && document.getElementById("dishWasher").style.display == "block"){
                document.getElementById("onoff").style.backgroundColor = "red";
                document.getElementById("onoff").innerHTML = "Off";
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
			function setup (){
				var random_id = "0000" + Math.floor(Math.random() * 10000)
					;

				app_name = app_name + ' ' + random_id.substring(random_id.length-4);

				// setup spacebrew
				sb = new Spacebrew.Client();  // create spacebrew client object

				sb.name(app_name);
				sb.description("This app sends text from an HTML form."); // set the app description

		        // create the spacebrew subscription channels
				sb.addPublish("text", "string", "");	// create the publication feed
				sb.addSubscribe("text", "string");		// create the subscription feed

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
				$("#name").html( message );
			}


			/**
			 * onStringMessage Function that is called whenever new spacebrew string messages are received.
			 *          It accepts two parameters:
			 * @param  {String} name    Holds name of the subscription feed channel
			 * @param  {String} value 	Holds value received from the subscription feed
			 */
			function onStringMessage( name, value ){
				console.log("[onBooleanMessage] boolean message received ", value);
				$("#msg_received").text(value); // display the sent message in the browser  
                if (value == "speaker"){
                    //console.log("Im am speaker");
                    connectSpeaker();
                }
                if (value == "tv"){
                    //console.log("Im am tv");
                    connectTV();
                }
                if (value == "radio"){
                    //console.log("Im am radio");
                    connectRadio();
                }
                if (value == "lamp"){
                    //console.log("Im am lamp");
                    connectLamp();
                }
			}




function washTouch(){
        document.getElementById("washingMachine").style.border = "thick solid #0000FF";
        connectWash();
    setTimeout(function () {
        document.getElementById("washingMachine").style.border = "#d4d4d4";
    }, 3000);
    }
    
    function dishTouch(){
        document.getElementById("dishWasher").style.border = "thick solid #0000FF";
        connectDish();
    setTimeout(function () {
        document.getElementById("dishWasher").style.border = "#d4d4d4";
    }, 3000);
    }
    
    
    function washClick(){
        document.getElementById("washingMachine").style.border = "thick solid #0000FF";
        connectWash();
    setTimeout(function () {
        document.getElementById("washingMachine").style.border = "#d4d4d4";
    }, 3000);
    }
    
    function dishClick(){
        document.getElementById("dishWasher").style.border = "thick solid #0000FF";
        connectDish();
    setTimeout(function () {
        document.getElementById("dishWasher").style.border = "#d4d4d4";
    }, 3000);
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
        }