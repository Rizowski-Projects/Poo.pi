import time
import RPi.GPIO as io
io.setmode(io.BCM)

door_pin = 23

io.setup(door_pin, io.IN, pull_up_down=io.PUD_UP)

while True:
  if io.input(door_pin)
    print("I no R door")
  else:
    print("I am door")
  time.sleep(0.5)
