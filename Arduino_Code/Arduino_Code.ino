/*COMMAND LIST
 * Format: [selector 1-8] [parmeter (cm, degrees)]
 * 1 - move forward x cm
 * 2 - turn right x degrees
 * 3 - move back x cm
 * 4 - turn left x degrees
 * 5 - return USRF value
 * 6 - move vertical servo by x degrees (-90 - 90)
 * 7 - move horizontal servo by x degrees (-90 - 90)
 * 8 - return servos to neutral (no x)
 * 9 - ping the serial line and toggle pin13 LED
 */

//Horizontal servo on A0
//Vertical servo on A1

#include <Servo.h>
#include <Wire.h>
#include <NXTShield.h>

//SET CAR WIDTH AND WHEEL DIAMETER SETTINGS 
int carWidth = 21; //cm
float wheelDia = 9.5; //cm

const float pi = 3.1415;

Motor1 rightMotor;
Motor2 leftMotor;
UltrasonicSensor USRF;

Servo servoHoriz;
Servo servoVert;

String serialInVal;
int selectionVal;
int commandVal;
double deg;
int servoHorizPos = 95;
int servoVertPos = 90;
bool state = HIGH;

float temp = carWidth/wheelDia;

void setup() {
  Serial.begin(9600);
  carWidth = carWidth;
  wheelDia = wheelDia / 2;
  pinMode(13, OUTPUT);

  servoHoriz.attach(A0);
  servoVert.attach(A1);

  //set servos to neutral
  servoHoriz.write(95);
  servoVert.write(90);
}

void loop() {

  if (Serial.available()) {
    serialInVal = Serial.readString();
    selectionVal = serialInVal[0] - '0';
    serialInVal.remove(0, 2);
    commandVal = serialInVal.toInt();

    if (selectionVal == 1) { //forward commandVal: cm to move
      deg = 360 / (2 * pi * wheelDia);
      deg = deg * commandVal; //Ben fixed this
      leftMotor.move(backward, 255, deg, brake);
      rightMotor.move(backward, 255, deg, brake);
      delay(10);
    }
    
    else if (selectionVal == 2) { //right commandVal: 0-360 degrees
      deg = (carWidth * commandVal) / wheelDia;
      for(int i=0; i<deg/2; i++){
        //Serial.println( i);
        leftMotor.move(backward, 255, temp*2, brake);
        rightMotor.move(forward, 255, temp*2, brake);
        delay(55);
      };
    }
    
    else if (selectionVal == 3) { //back commandVal: cm to move
      deg = 360 / (2 * pi * wheelDia);
      deg = deg * commandVal; //Ben fixed this
      leftMotor.move(forward, 255, deg, brake);
      rightMotor.move(forward, 255, deg, brake);
      delay(10);
    }
    
    else if (selectionVal == 4) { //left commandVal: 0-360 degrees
      deg = (carWidth * commandVal) / wheelDia;
      for(int i=0; i<deg/2; i++){
        leftMotor.move(forward, 255, temp*2, brake);
        rightMotor.move(backward, 255, temp*2, brake);
        delay(55);
      };
    }
    
    else if (selectionVal == 5) { // get USRF value 
      Serial.print(USRF.readDistance());
      Serial.println("cm");
    }

    else if (selectionVal == 6) {//vertical servo
      servoVertPos = servoVertPos + commandVal;
      if (servoVertPos < 0) {
        servoVertPos = 0;
      }
      else if (servoVertPos > 180) {
        servoVertPos = 180;
      }
      servoVert.write(servoVertPos);
    }
    
    else if (selectionVal == 7) { //horizontal servo
      servoHorizPos = servoHorizPos + commandVal;
      if (servoHorizPos < 0) {
        servoHorizPos = 0;
      }
      else if (servoHorizPos > 180) {
        servoHorizPos = 180;
      }
      servoHoriz.write(servoHorizPos);
    }
    
    else if (selectionVal == 8) {
      servoHoriz.write(95);
      servoVert.write(90);
      servoVertPos = 90;
      servoHorizPos = 90;
    }
    
    else if (selectionVal == 9) {//ping buggy
      digitalWrite(13, state);
      state = !state;
    }
    
    else {
      Serial.println("error 1 - invalid command syntax");
    }
    
    serialInVal = "";
    if (selectionVal != 5) {
      Serial.println("move complete");
    }
  }
}

