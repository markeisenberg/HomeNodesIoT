$(function () {
    PushBullet.APIKey = "o.ji4B40oFnMGjdjApLyigjutk0tMDQmU6";
    //document.getElementById("result").innerHTML = JSON.stringify(PushBullet.pushHistory(), null, 4);

    //var data = JSON.parse(PushBullet.pushHistory(), null, 4);
    
   /* var timerLoop;
    var timer = function(){
            refresh();
            $('#result').load(document.URL +  ' #result');
            timerLoop = setTimeout(timer, 1000);
        };
    timer(); */

    var yourval;
    
    function refresh(){
     yourval = jQuery.parseJSON(JSON.stringify(PushBullet.pushHistory(), null, 4));
        //checkName();
    }
    //alert(req.pushes[0]);
    //console.log(pushes);
    
    refresh();

    var selectedNFC = yourval['pushes'][0].body;
    
    if (selectedNFC == "Radio") {
        document.getElementById("result").innerHTML = "I am radio"
        //console.log("I am radio");
    }
    if (selectedNFC == "Speaker") {
        document.getElementById("result").innerHTML = "I am stereo"
        //console.log("I am stereo");
    }
    if (selectedNFC == "TV") {
        document.getElementById("result").innerHTML = "I am TV"
        //console.log("I am TV");
    }
    if (selectedNFC == "Lamp") {
        document.getElementById("result").innerHTML = "I am Lamp"
        //console.log("I am Lamp");
    }
    
    var timerLoop;
    var timer = function(){
            refresh();
            $('#result').load(document.URL +  ' #result');
            timerLoop = setTimeout(timer, 6000);
        };
    timer();
});
