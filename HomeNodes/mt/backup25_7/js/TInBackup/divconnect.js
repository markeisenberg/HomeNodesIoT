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
var externalToLamp = false;
var externalToTV = false;
var externalToRadio = false;
var externalToSpeaker = false;

$(document).ready(function () {

    // Declare these variables so you don't have
    // to type the full namespace
    var pMTProcessor = null;
    var myElement = document.querySelector("#state");


    //startProtobject();
    //startNFCListener();
    plusDivs(0); //makes slideshow div active briefly on startup

    // attach fastclick to avoid 300ms click delay on mobile devices
    FastClick.attach(document.body);

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

        
        //Make nodes active    
        $('#washingMachine').bind("touchstart", sendWashing);
        $('#dishWasher').bind("touchstart", sendDish);
        
        $('#leftArrow').bind("touchstart", sendLeft);
        $('#rightArrow').bind("touchstart", sendRight);
        
        $('#onoff').bind("touchstart", sendSwitch);

        //Confirm deletion
        $('#bin').bind("touchstart", sendBin);

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

function deleteClicked() {
    //alert("Im clicked");
    
    if (speakerActive == true && tvActive == true) {
        document.getElementById("speakerTV").style.display = "none";
    }
    if (lampActive == true && radioActive == true) {
        document.getElementById("lampRadio").style.display = "none";
    }
    if (speakerActive == true && lampActive == true) {
        document.getElementById("speakerLamp").style.display = "none";
    }
    if (tvActive == true && lampActive == true) {
        document.getElementById("tvLamp").style.display = "none";
    }
    if (radioActive == true && speakerActive == true) {
        document.getElementById("radioSpeaker").style.display = "none";
    }
    if (radioActive == true && tvActive == true) {
        document.getElementById("radioTV").style.display = "none";
    }
    //Dish
    if (dishActive == true && tvActive == true) {
        document.getElementById("externalTV").style.display = "none";
    }
    if (dishActive == true && speakerActive == true) {
        document.getElementById("externalSpeaker").style.display = "none";
    }
    if (dishActive == true && lampDeletePhase == true) {
        document.getElementById("externalLamp").style.display = "none";
    }
    if (dishActive == true && radioDeletePhase == true) {
        document.getElementById("externalRadio").style.display = "none";
    }
    //Washing
    if (washActive == true && tvActive == true) {
        document.getElementById("externalTV").style.display = "none";
    }
    if (washActive == true && speakerActive == true) {
        document.getElementById("externalSpeaker").style.display = "none";
    }
    if (washActive == true && lampDeletePhase == true) {
        document.getElementById("externalLamp").style.display = "none";
    }
    if (washActive == true && radioDeletePhase == true) {
        document.getElementById("externalRadio").style.display = "none";
    }

}

function goRight(){
    plusDivs(1);
}

function goLeft(){
    plusDivs(-1);
}

function connectWash() {
    document.getElementById("washingMachine").style.border = "thick solid #0000FF";
    washActive = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        document.getElementById("washingMachine").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
        washActive = false;
    }, 3000);
}

function connectDish() {
    document.getElementById("dishWasher").style.border = "thick solid #0000FF";
    dishActive = true;
    checkConnection();
    setTimeout(function () {
        document.getElementById("tvNode").style.border = "#d4d4d4";
        document.getElementById("speakerNode").style.border = "#d4d4d4";
        document.getElementById("lampNode").style.border = "#d4d4d4";
        document.getElementById("radioNode").style.border = "#d4d4d4";
        document.getElementById("dishWasher").style.border = "#d4d4d4";
        lampActive = false;
        tvActive = false;
        speakerActive = false;
        radioActive = false;
        dishActive = false;
    }, 3000);
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
