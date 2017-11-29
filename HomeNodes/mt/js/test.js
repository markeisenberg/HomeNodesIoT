$(document).ready(function() {
    // Declare these variables so you don't have
    // to type the full namespace
    var IOBoard = BO.IOBoard;
    var IOBoardEvent = BO.IOBoardEvent;
    var LED = BO.io.LED;
    var Button = BO.io.Button;
    var ButtonEvent = BO.io.ButtonEvent;

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
    var button;
    var $state = $('#state');
    var $schematic = $('#schematic');

    // Handle showing and hiding the schematic
    $('#schematicBtn').on('click', toggleSchematicView);

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
      button = new Button(arduino, arduino.getDigitalPin(2));

      // Listen for button press and release events
      button.addEventListener(ButtonEvent.PRESS, onPress);
      button.addEventListener(ButtonEvent.RELEASE, onRelease);

      // Use jQuery to get a reference to the buttons
      // and listen for click events
      $('#btnLeftA').on('click', turnLedAOff);
      $('#btnRightA').on('click', turnLedAOn);
        
        $('#btnLeftB').on('click', turnLedBOff);
      $('#btnRightB').on('click', turnLedBOn);
        
        $('#btnLeftC').on('click', turnLedCOff);
      $('#btnRightC').on('click', turnLedCOn);
        
        $('#btnLeftD').on('click', turnLedDOff);
      $('#btnRightD').on('click', turnLedDOn);
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

    // Show or hide the schematic
    function toggleSchematicView(evt) {
      var schematicBtn = $(this);
      if (schematicBtn.data('state') === "hidden") {
        schematicBtn.text("Hide Schematic");
        schematicBtn.data('state', "visible");
        $schematic.css('display', 'block');
      } else {
        schematicBtn.text("Show Schematic");
        schematicBtn.data('state', "hidden");
        $schematic.css('display', 'none');
      }
    }
  });