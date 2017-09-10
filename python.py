import win32gui
import win32api
import os
Media_Next = 0xB0
Media_Previous = 0xB1
Media_Pause = 0xB3 ##Play/Pause
Media_Mute = 0xAD
Volume_down = 0xAE
def hwcode(Media):
	hwcode = win32api.MapVirtualKey(Media, 0)
	return hwcode

def next():
	win32api.keybd_event(Media_Next, hwcode(Media_Next))
	
def previous():
	win32api.keybd_event(Media_Previous, hwcode(Media_Previous))
	
def pause():
	win32api.keybd_event(Media_Pause, hwcode(Media_Pause))
	
def play():
	win32api.keybd_event(Media_Pause, hwcode(Media_Pause))
def lower():
	win32api.keybd_event(Volume_down, hwcode(Volume_down))
def mute():
	win32api.keybd_event(Media_Mute, hwcode(Media_Mute))
for i in range(1, 100):
	lower()
#from flask import Flask
#app = Flask(__name__)

#@app.route("/")
#def hello():
#    return "Hello World!"

#if __name__ == "__main__":
#    app.run()