# mqtt-performance-evaluation
Tasked by the August Willhelm Scheer Institut, this project aims to measure, compare and evaluate the performance in mqtt communication provided by various programming languages.
The full original task-description is contained in the repository: *Assessment_Wagner_20200525.pdf*
In order to test this locally a local broker should be used. Inside the folder *broker* a docker compose for the [Eclipse Mosquitto](https://mosquitto.org/) is provided.

## considerations
- Network speed must not be a determining factor
- All Programs shall use MQTT, not MQTT over WebSocket (this is not a comparison of MQTT and MQTT over Websocket, although one could later be of interest)
- Given the same data and configuration, do the various mqtt frameworks create the same frame? (Are headers the same size? Is a payload encoding enforced?)
- In order to compensate run to run variance,  measure the average time over multiple executions
- Code execution time is expected to be of more importance than transmission specified
- Compare against at least one compiled language
- MQTT max payload is 268435455 bytes
- Broker speed must not determine metrics
- export metrics to csv for ease of comparison

## Programing languages
1. *JavaScript*
The task itself calls for JavaScript to be evaluated. In this implementation Node.js is used as it provides the necessary frameworks (mqtt and timing).
As mqtt ramework [MQTT.js](https://github.com/mqttjs/MQTT.js) has been chose, as it is sophisticated, widely used and well documented. It would have been preferable to use [eclipse paho](https://github.com/eclipse/paho.mqtt.javascript) as this framework is available for other programming languages as well, but its javascript implementation only provides MQTT over WebSocket.

2. *Python*
As another widely used scripting language Python was chosen. It is generally considered to be slower than node.js [(benchmarks)](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/node-python3.html). It will be interesting to see whether this is true for MQTT as well. [paho](https://www.eclipse.org/paho/clients/python/) is used for the MQTT framework.

3. *C++*
Other than the above C++ is a compiled Language and should in theory thus be faster. Here too [paho](https://www.eclipse.org/paho/clients/cpp/) will be used.

4. *Go*
As well as C++ this is a compiled Language and should in theory thus be faster. Again Paho can be used will be used.

## Possible Methods
### Frame comparison
Given the exact same configuration and payload. Do the frames differ? A difference in size may indicate a difference in performance.
- An empty payload is legal, so comparison of header data only can Easily be accomplished
- For payload comparison all frameworks will send a set utf-8 encoded string.
Frames are being captured using `tcpdump -s 65535 -w <outputfile> port 1883` on the broker-docker

### Round Trip Time
As stated in the task itself, the Round Trip Time may be used as a metric for determining the programming languages performance.
Though obviously of relevance, this can not reliably be measured using a public broker, as it strongly depends on network speed and broker performance. Both may vary even when using the same broker and the same network connection. Connection speed may change due to fluctuations in traffic, while broker speed may change by workload and resources allocated. Thus for measuring the Round Trip Time, a local Broker must be used. Although even the local broker might show variance in forwarding speeds, it is much more controllable than some third party broker

### Publish time
One of the most reliably measurable metrics. The time it takes for the publish call to be executed (given the framework's publish call is blocking!).
Should be an average measured over multiple executions using the same payload. Payload size might matter, so execute with different sizes.
Also to be taken into consideration:

### Time between packet receive and availability in program
TODO a method for measuring this must yet be derived

### Subscribe and connect execution time
Easily measurable metric but of very low relevance


# findings
No all Methods have been used. These are the findings derived from the Methods applied:

## Frame comparison
Both Python and JavaScript send equally big headers and on empty messages, no message data at all.

### Subscribe and connect execution time

### Publish time
