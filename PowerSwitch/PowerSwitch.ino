/*
Code From:
https://github.com/ibenot/Arduino/tree/master/TP4_433MHz_Transmitter
*/

#include <RCSwitch.h>
RCSwitch mySwitch = RCSwitch();

int sleep = 1000;
int transmit_pin = 10; //10 for Arduino / 1 for Wemos D1
int pulseLength = 290;
int repeatTransmit = 5;

int analogPin3 = 3;
int analogPin0 = 0;
int analogPin1 = 1;
int analogPin2 = 2;
int val3 = 0;
int val0 = 0;
int val1 = 0;
int val2 = 0;

void setup() {
  Serial.begin(9600);
  mySwitch.enableTransmit(transmit_pin);
  mySwitch.setPulseLength(pulseLength);
  mySwitch.setRepeatTransmit(repeatTransmit);
}

void loop() {
    
  //-- Chacon power outlet --

  val3 = analogRead(analogPin3);
  val0 = analogRead(analogPin0);
  val1 = analogRead(analogPin1);
  val2 = analogRead(analogPin2);
  //Serial.println(val3);
  Serial.println(val2);

  if (val3 < 500){
    Serial.println("A Off");
    mySwitch.sendTriState("000000FFFFF0"); delay(sleep);
  }
  else {
    Serial.println("A On");
    mySwitch.sendTriState("000000FFFF0F"); delay(sleep);
  } 

  if (val0 < 500){
    Serial.println("B Off");
    mySwitch.sendTriState("00000F0FFFF0"); delay(sleep);
  }
  else {
    Serial.println("B On");
    mySwitch.sendTriState("00000F0FFF0F"); delay(sleep);
  }

  if (val1 < 500){
    Serial.println("C Off");
    mySwitch.sendTriState("00000FF0FFF0"); delay(sleep);
  }
  if (val1 > 500){
    Serial.println("C On");
    mySwitch.sendTriState("00000FF0FF0F"); delay(sleep);
  }

  if (val2 < 500){
    Serial.println("D Off");
    mySwitch.sendTriState("00000FFF0FF0"); delay(sleep);
  }
  if (val2 > 500){
    Serial.println("D On");
    mySwitch.sendTriState("00000FFF0F0F"); delay(sleep);
  }

/*
  //ON A
  mySwitch.sendTriState("000000FFFF0F"); Serial.println("Power #A: ON"); delay(sleep); 

  //OFF A
  mySwitch.sendTriState("000000FFFFF0"); Serial.println("Power #A: OFF"); delay(sleep);

  //ON B
  mySwitch.sendTriState("00000F0FFF0F"); Serial.println("Power #B: ON"); delay(sleep); 

  //OFF B
  mySwitch.sendTriState("00000F0FFFF0"); Serial.println("Power #B: OFF"); delay(sleep);

  //ON C
  mySwitch.sendTriState("00000FF0FF0F"); Serial.println("Power #C: ON"); delay(sleep); 

  //OFF C
  mySwitch.sendTriState("00000FF0FFF0"); Serial.println("Power #C: OFF"); delay(sleep);

  //ON D
  mySwitch.sendTriState("00000FFF0F0F"); Serial.println("Power #D: ON"); delay(sleep); 

  //OFF D
  mySwitch.sendTriState("00000FFF0FF0"); Serial.println("Power #D: OFF"); delay(sleep); */

}
