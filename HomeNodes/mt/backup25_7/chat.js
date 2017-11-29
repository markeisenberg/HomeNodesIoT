//make connection
var socket = io.connect('http://localhost:4000');

//query dom
var output = document.getElementById('output');

//emit events
//window.onload = sendWashing;

function sendWashing(){
    socket.emit('chat', {
        message: "washing"
    });
}

function sendDish(){
    socket.emit('chat', {
        message: "dish"
    });
}

function sendBin(){
    socket.emit('chat', {
        message: "bin"
    });
}

function sendRight(){
    socket.emit('chat', {
        message: "right"
    });
}

function sendLeft(){
    socket.emit('chat', {
        message: "left"
    });
}

function sendSwitch(){
    socket.emit('chat', {
        message: "switch"
    });
}

//listen for events
socket.on('chat', function(data){
   if(data.message == "washing"){
      //console.log("I am washing");
      connectWash();
      }
    if(data.message == "dish"){
      //console.log("I am washing");
      connectDish();
      }
    if(data.message == "left"){
      //console.log("I am washing");
      goLeft();
      }
    if(data.message == "right"){
      //console.log("I am washing");
      goRight();
      }
    if(data.message == "switch"){
      //console.log("I am washing");
      switchExternal();
      }
    if(data.message == "bin"){
      //console.log("I am washing");
      deleteClicked();
      }
    console.log(data.message);
});