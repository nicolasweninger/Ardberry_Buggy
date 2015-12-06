#!/usr/bin/python 

# COMMAND LIST
#  * Format: [selector 1-8] [command (cm, degrees)]
#  * 1 - move forward x cm
#  * 2 - turn right x degrees
#  * 3 - move back x cm
#  * 4 - turn left x degrees
#  * 5 - return USRF value
#  * 6 - move vertical servo by x degrees (-90 - 90)
#  * 7 - move horizontal servo by x degrees (-90 - 90)
#  * 8 - return servos to neutral (no x)
#  * 9 - ping the serial line and toggle pin13 LED

import serial
import cgi, cgitb, fcntl
import time
import traceback

#threshholds
linearThreshhold = 200 #max cm value buggy can move forward or backward
rotationalThreshhold = 360 #max degrees can rotate by

#global vars init
servoHoriz = 90
servoVert = 90
inCmd = ""
inSel = ""

# Create instance of FieldStorage 
form = cgi.FieldStorage() 

#custom exceptions
class OutOfRange(Exception):
	pass


try:
	ser = serial.Serial()
	ser.braudrate = 9600
	ser.timeout = 10
	ser.port = "/dev/ttyACM0"

	# function to send values to Arduino and error check
	def execute(selectionVal, commandVal): 
			ser.flushInput()
			out = ""
			try:
				#error handling
				if selectionVal <= 0 or selectionVal > 9:
					raise ValueError
				if (commandVal < 0 and (selectionVal != 6 and selectionVal != 7)):
					raise ValueError
				if selectionVal == 1 or selectionVal == 3: #linear movement catching
					if commandVal > linearThreshhold:
						raise OutOfRange
				if selectionVal == 2 or selectionVal == 4: # rot movement catching
					if commandVal > rotationalThreshhold:
						raise OutOfRange

				#send commands down serial line	
				ser.write(str(selectionVal) + " " + str(commandVal))
				
				# wait for responce from Arduino
				while (ser.inWaiting() == 0):
					pass

				time.sleep(0.2)

				while ser.inWaiting() > 0:
					out += ser.read(1)
					
				# return reponce
				if out != "" and selectionVal != 9:
					print "Content-type:text/html\r\n\r\n"
					print out
				elif out != "":
					print "Content-type:text/html\r\n\r\n"
					print "Connected"

			except ValueError:
				tb = traceback.format_exc()
				print "Content-type:text/html\r\n\r\n"
				print "Error A - invalid selector"
				print str(selectionVal) +" " + str(commandVal)
				print tb
			except OutOfRange:
				print "Content-type:text/html\r\n\r\n"
				print "Error B - parameter entered out of threshhold range (" +  linearThreshhold + "/" + rotationalThreshhold + ")"

	out = ""
	ser.open()
	inCmd = form.getvalue('cmd')
	inSel  = form.getvalue('sel')
	try:
		inCmd =  int(inCmd)
		inSel =  int(inSel)
	except TypeError:
		inCmd = 0
		inSel = 0
		print "Content-type:text/html\r\n\r\n"
		print "Error C - integer conversion error"
		exit()
	execute(inSel, inCmd)
	ser.close()

except serial.serialutil.SerialTimeoutException:
	print "Content-type:text/html\r\n\r\n"
	print "Error D - serial connection timed out"
except serial.serialutil.SerialException:
	print "Content-type:text/html\r\n\r\n"
	print "Error E - could not open serial connection"

exit()
