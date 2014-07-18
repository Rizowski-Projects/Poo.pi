import time
import socket
import RPi.GPIO as io
io.setmode(io.BCM)

door_pin = 23
last_status = False

s = socket.socket(socket.AF_INET, socket.SOCK_STEAM)
s.bind(('localhost', 8000))
s.listen(5)

io.setup(door_pin, io.IN, pull_up_down=io.PUD_UP)

while True:
  (client, address) = s.accept()
  if io.input(door_pin):
    print("I not R door")
    if last_status:
      client.sendall(False)
      last_status = False
  else:
    print("I am door")
    if not last_status:
      client.sendall(True)
      last_status = True
  time.sleep(0.5)
