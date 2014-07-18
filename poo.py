import time
import socket
import RPi.GPIO as io
io.setmode(io.BCM)

door_pin = 23
last_status = False

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 8000))
s.listen(5)

io.setup(door_pin, io.IN, pull_up_down=io.PUD_UP)

(client, address) = s.accept()
while True:
  if io.input(door_pin):
    print("I not R door")
    if last_status:
      client.send(bytes("false").encode('UTF-8'))
      last_status = False
  else:
    print("I am door")
    if not last_status:
      client.send(bytes("true").encode('UTF-8'))
      last_status = True
  time.sleep(0.5)
