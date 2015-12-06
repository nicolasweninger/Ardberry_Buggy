//# COMMAND LIST
//#  * Format: [selector 1-8] [parmeter (cm, degrees)]
//#  * 1 - move forward x cm
//#  * 2 - turn right x degrees
//#  * 3 - move back x cm
//#  * 4 - turn left x degrees
//#  * 5 - return USRF value
//#  * 6 - move vertical servo by x degrees (-90 - 90)
//#  * 7 - move horizontal servo by x degrees (-90 - 90)
//#  * 8 - return servos to neutral (no x)
//#  * 9 - ping the serial line and toggle pin13 LED

//camera code-----------------------------------------------------------
var mjpeg_img;
mjpeg_img = document.getElementById("mjpeg_dest");

function reload_img() {
    mjpeg_img.src = "camera/cam_pic.php?time=" + new Date().getTime();
    
}
//--------------------------------------------------------------------

// Variable init
var pythonFileName = "/cgi-bin/Ardberry_MAIN.cgi";
var loadInterval = 200;
var servoHoriz = 95;
var servoVert = 90;

var defaultLinear = 15; //cm
var defaultRotation = 30; //degrees
var defaultServo = 20; //degrees

//Functions
//mode = 0: use dafault values
//mode = 1: use values in text fields
//one of CamUp or CamDown command values multiplied by -1 to give negative degree movement

function sendSerialCommand(selection, command) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (selection !== 5) {
                document.getElementById("output2").innerHTML = xmlhttp.responseText;
                document.getElementById("output2").style.color = "green";
            } else {
                document.getElementById("output1").innerHTML = xmlhttp.responseText;
                document.getElementById("output1").style.color = "green";
            }
        }
    };

    xmlhttp.open("GET", pythonFileName + "?sel=" + selection + "&cmd=" + command, true);
    xmlhttp.send();
}

function forwardMove(mode) {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving forwards...";
    if (mode === 0) {
        commandVal = defaultLinear;
    } else {
        commandVal = document.getElementById("linearText").value;
    }
    sendSerialCommand(1, commandVal);
}

function backwardMove(mode) {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving backwards...";
    if (mode === 0) {
        commandVal = defaultLinear;
    } else {
        commandVal = document.getElementById("linearText").value;
    }
    sendSerialCommand(3, commandVal);
}

function leftMove(mode) {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Turning left...";
    if (mode === 0) {
        commandVal = defaultRotation;
    } else {
        commandVal = document.getElementById("rotationText").value;
    }
    sendSerialCommand(4, commandVal);
}

function rightMove(mode) {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Turning right...";
    if (mode === 0) {
        commandVal = defaultRotation;
    } else {
        commandVal = document.getElementById("rotationText").value;
    }
    sendSerialCommand(2, commandVal);
}

function downCam() {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving camera down...";
    commandVal =  defaultServo;
    sendSerialCommand(6, commandVal);
}

function upCam() {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving camera up...";
    commandVal = -1*defaultServo;
    sendSerialCommand(6, commandVal);
}

function leftCam() {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving camera left...";
    commandVal = defaultServo;
    sendSerialCommand(7, commandVal);
}

function rightCam() {
    var commandVal;
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Moving camera right...";
    commandVal = -1 * defaultServo;
    sendSerialCommand(7, commandVal);
}

function resetCam() {
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Setting default camera position...";
    sendSerialCommand(8, 0);
}

function getDistance() {
    document.getElementById("output1").style.color = "red";
    sendSerialCommand(5, 0);
}

function ping() {
    document.getElementById("output2").style.color = "red";
    document.getElementById("output2").innerHTML = "Connecting...";
    sendSerialCommand(9, 0);
}


//Main loop
window.onload = function () {
    document.getElementById("output1").style.color = "green";
    document.getElementById("buggyLeft").addEventListener("click", function () {leftMove(0); });
    document.getElementById("buggyRight").addEventListener("click", function () {rightMove(0); });
    document.getElementById("buggyUp").addEventListener("click", function () {forwardMove(0); });
    document.getElementById("buggyDown").addEventListener("click", function () {backwardMove(0); });
    document.getElementById("servoUp").addEventListener("click", function () {upCam(0); });
    document.getElementById("servoDown").addEventListener("click", function () {downCam(0); });
    document.getElementById("servoLeft").addEventListener("click", function () {leftCam(0); });
    document.getElementById("servoRight").addEventListener("click", function () {rightCam(0); });
};

window.setInterval(reload_img, loadInterval);
