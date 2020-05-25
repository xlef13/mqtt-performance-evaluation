import paho.mqtt.client as mqtt
import sys
import performanceObserver
import time
import payloads

observer = performanceObserver.PerformanceObserver()

# config
host="localhost"
port=1883
numberOfPublishes = 1
payload = payloads.big

# The callback for CONNACK
def on_connect(client, userdata, flags, rc):
    pass

# The callback for message receive
def on_message(client, userdata, msg):
    observer.mark("received")
    observer.measure("published to received","published", "received")

# cleanup on close
def on_socket_close(client, userdata, sock):
    print("connection closed")
    sys.exit([0])

# create client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message


# connection is created synchronously
observer.mark("connecting")
client.connect(host, port, 60)
observer.mark("connected")
observer.measure("connecting to connected","connecting", "connected")

# client is watching for events asynchronously
client.loop_start()

# Subscribe to the required Topic
observer.mark("subscribing")
client.subscribe("payload/empty")
observer.mark("subscribed")
observer.measure("subscribing to subscribed","subscribing", "subscribed")

# Publish and measure Round Trip Time
for i in range(0,numberOfPublishes):
    observer.mark("publishing")
    client.publish("payload/empty", payload="", qos=0, retain=False)
    observer.mark("published")
    observer.measure("publishing to published","publishing", "published")
    time.sleep(0.1)

observer.printResult()

# cleanup
client.loop_stop()
sys.exit()
