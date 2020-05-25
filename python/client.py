import paho.mqtt.client as mqtt
import sys

# The callback for CONNACK
def on_connect(client, userdata, flags, rc):
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    if client.subscribe("payload/testbig"):
        client.publish("payload/testbig", payload="Big payload", qos=0, retain=False)

# The callback for message receive
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    client.disconnect()

# cleanup on close
def on_socket_close(client, userdata, sock):
    print("connection closed")
    sys.exit([0])

# create client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

# client loop
client.loop_forever()
