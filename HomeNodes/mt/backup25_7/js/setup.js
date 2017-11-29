$(document).ready(function() {


    // Declare these variables so you don't have
    // to type the full namespace
    var IOBoard = BO.IOBoard;
    var IOBoardEvent = BO.IOBoardEvent;
    var LED = BO.io.LED;
    var Button = BO.io.Button;
    var ButtonEvent = BO.io.ButtonEvent;
    var pMTProcessor = null;

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

    // Write the surface properties.
				Surface_PropertiesChanged();
				
				// Fade the display in.
				$("body").fadeIn();
				
				// Enable multi-touch.
				pMTProcessor = new KinectTouch({
					debug : true,               // Turn on debug points.
					trails : true,              // Turn on finger trails (this shows the Kinect data used to detect the finger).
					point_limit : 200,          // The number of points we are allowed to process.
					surface_zoffset : 0.010,    // The offset from the surface (in meters) at which to start capturing data.
					height : 0.01,              // The distance from the surface offset (in meters) at which to stop capturing data.
				});

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

      // Create a new Button object to interface with the physical
      // button wired to the I/O board
      button = new Button(arduino, arduino.getDigitalPin(2));

      // Listen for button press and release events
      button.addEventListener(ButtonEvent.PRESS, onPress);
      button.addEventListener(ButtonEvent.RELEASE, onRelease);

      // Use jQuery to get a reference to the buttons
      // and listen for click events
      $('#btnLeft').bind("touchstart", turnLedOff);
      $('#btnRight').bind("touchstart", turnLedOn);
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

    function turnLedOn(evt) {
      // Turn the LED on
      led.on();
    }

    function turnLedOff(evt) {
      // Turn the LED off
      led.off();
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

  function Surface_PropertiesChanged()
			{
				$("#surf_name").text("" + Surface.Name);
				$("#surf_dims").text("" + round(Surface.Width, 2) + "m x " + round(Surface.Height, 2) + "m");
				$("#surf_angle").text("" + round(Surface.Angle * 57.2957795, 2) + " degrees");
			}
			
			/** Called by another display when this one should fade out. */
			function startFade(src_name, data)
			{
				$("body").fadeOut(function(){});
			}