import oscP5.*;
import netP5.*;
import spacebrew.*;
import mqtt.*;

MQTTClient client;

// MQTT Library by Joël Gähwiler
// https://github.com/256dpi/processing-mqtt
  
OscP5 oscP5;
NetAddress myRemoteLocation;

String server="localhost";
String name="P5 String Example";
String description ="Client that sends and receives string messages.";

Spacebrew sb;

// Keep track of our current place in the range
String local_string = "";
String remote_string = "";

void setup() {
  size(400,400);
  frameRate(25);
  
  oscP5 = new OscP5(this,7400);
  TestListener t = new TestListener();
  oscP5.addListener(t);  
  myRemoteLocation = new NetAddress("127.0.0.1",12000);
  
  oscP5.plug(this, "nfc", "/nfc");
  
  // instantiate the spacebrewConnection variable
  sb = new Spacebrew( this );

  // declare your publishers
  sb.addPublish( "listen_to_me", "string", remote_string ); 

  // declare your subscribers
  sb.addSubscribe( "say_something", "string" );

  // connect!
  sb.connect(server, name, description );
  
  //MQTT
  client = new MQTTClient(this);
  client.connect("mqtt://localhost", "processing-1234");
  client.subscribe("World");
}
void test(float theValue) {
  println("\ngot a message with address pattern /test and typetag i (float).");
  println("value: "+theValue);
  n = theValue;
}

float n;
void draw() {
  background(n++);
  n %= 255;  
}

void oscEvent(OscMessage theOscMessage) {
  print("\nreceived an osc message.");
  print(" addrpattern: "+theOscMessage.addrPattern());
  println(" typetag: "+theOscMessage.typetag());
  
  if(theOscMessage.addrPattern().equals("/nfc") && 
     theOscMessage.typetag().equals("i")) {

      println("got a /test message with typetag i (float)");
      float a = theOscMessage.get(0).floatValue();
      println("value at index 0 (float expected) : "+a);
  }
}

class TestListener implements OscEventListener {
  
  public void oscEvent(OscMessage theEvent) {
    float a = theEvent.get(0).floatValue();
    println("\ncustom OscEventListener Test\nreceived an osc message\nvalue at index 0 (int expected) : "+a);
    if (a == 3.6396146E16){
      println("you found TV");
      remote_string = "tv"; 
      sb.send("listen_to_me", remote_string);
      //last_string = local_string;
       
    }
    if (a == 3.6097658E16){ 
      println("you found Speaker"); //
      remote_string = "speaker";  
      sb.send("listen_to_me", remote_string);
      //last_string = local_string;
      
    }
    if (a == 3.6114688E16){ 
      println("you found Lamp");
      remote_string = "lamp";  
      sb.send("listen_to_me", remote_string);
      //last_string = local_string;
      
    }
    if (a == 3.6122414E16){ 
      println("you found Radio");
      remote_string = "radio"; 
      sb.send("listen_to_me", remote_string);
     // last_string = local_string;
       
    }
  }
  
  public void oscStatus(OscStatus theStatus) {
    println("osc status : "+theStatus.id());
  }  
}

void onStringMessage( String name, String value ){
  println("got string message " + name + " : " + value);
  remote_string = value;
}


void messageReceived(String topic, byte[] payload) {
  println("new message: " + topic + " - " + new String(payload));
  
  if(payload[0] == 82){
    println("Hey Radio!");
    remote_string = "rswitch"; 
      sb.send("listen_to_me", remote_string);
  }
  if(payload[0] == 84){
    println("Hey TV!");
    remote_string = "tswitch"; 
      sb.send("listen_to_me", remote_string);
  }
  if(payload[0] == 76){
    println("Hey Lamp!");
    remote_string = "lswitch"; 
      sb.send("listen_to_me", remote_string);
  }
  if(payload[0] == 83){
    println("Hey Speaker!");
    remote_string = "sswitch"; 
      sb.send("listen_to_me", remote_string);
  }
}