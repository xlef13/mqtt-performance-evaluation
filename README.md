# mqtt-performance-evaluation
Tasked by the August Wilhelm Scheer Institut, this project aims to measure, compare and evaluate the performance in mqtt communication provided by various programming languages.
The full original task-description is contained in the repository: *Assessment_Wagner_20200525.pdf*
In order to test this locally a local broker should be used. Inside the folder *broker* a docker compose for the [Eclipse Mosquitto](https://mosquitto.org/) is provided.

## considerations
- Network speed must not be a determining factor
- All Programs shall use MQTT, not MQTT over WebSocket (this is not a comparison of MQTT and MQTT over Websocket, although one could later be of interest)
- Given the same data and configuration, do the various MQTT frameworks create the same frame? (Are headers the same size? Is a payload encoding enforced?)
- In order to compensate run to run variance,  measure the average time over multiple executions
- Code execution time is expected to be of more importance than transmission speed
- (Compare against at least one compiled language)
- MQTT max payload is 268435455 bytes
- Broker speed must not determine metrics
- export metrics to csv for ease of comparison

## Programing languages
1. *JavaScript*
The task itself calls for JavaScript to be evaluated. In this implementation Node.js is used as it provides the necessary frameworks (mqtt and timing).
As mqtt framework [MQTT.js](https://github.com/mqttjs/MQTT.js) has been chose, as it is sophisticated, widely used and well documented. It would have been preferable to use [eclipse paho](https://github.com/eclipse/paho.mqtt.javascript) as this framework is available for other programming languages as well, but its JavaScript implementation only provides MQTT over WebSocket.

2. *Python*
As another widely used scripting language Python was chosen. It is generally considered to be slower than node.js [(benchmarks)](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/node-python3.html). It will be interesting to see whether this is true for MQTT as well. [paho](https://www.eclipse.org/paho/clients/python/) is used for the MQTT framework.

3. *NOT TESTED: C++*
Other than the above C++ is a compiled Language and should in theory thus be faster. Here too [paho](https://www.eclipse.org/paho/clients/cpp/) will be used.

4. *NOT TESTED: Go*
As well as C++ this is a compiled Language and should in theory thus be faster. Again Paho can be used.

## Possible Methods
### Frame comparison
Given the exact same configuration and payload. Do the frames differ? A difference in size may indicate a difference in performance.
- An empty payload is legal, so comparison of header data only can easily be accomplished
- For payload comparison all frameworks will send a set utf-8 encoded string.
Frames are being captured using `tcpdump -s 65535 -w <outputfile> port 1883` on the broker-docker

### Round Trip Time
As stated in the task itself, the Round Trip Time may be used as a metric for determining the programming languages performance.
Though obviously of relevance, this can not reliably be measured using a public broker, as it strongly depends on network speed and broker performance. Both may vary even when using the same broker and the same network connection. Connection speed may change due to fluctuations in traffic, while broker speed may change by workload and resources allocated. Thus, for measuring the Round Trip Time, a local broker must be used. Although even the local broker might show variance in forwarding speed, it is much more controllable than some third party broker

### Publish time
Publish time is one of the most reliably measurable metrics. It is the time it takes for the publish call to be executed (given the framework's publish call is blocking!).
This should be an average measured over multiple executions using the same payload. Payload size might matter, so tests using different sizes should be executed.
Also to be taken into consideration:

### Time between packet receive and availability in program
TODO a method for measuring this must yet be derived

### Subscribe and connect execution time
Easily measurable metric but of very low relevance


# Findings
*The task has not been fully fulfilled.* Only two Programming languages have been successfully implemented and measured. Not all Methods have been used. The tests executed as part of this task are hard to be taken as proof for one programming language being the faster one. The frameworks applied use different means of function and are thus hard to compare. MQTT is designed as a very light protocol and thus expected to be fast. JavaScript could be considered the faster of the two languages compared, since the MQTT.js framework spends less time in the main thread but this is use case dependent. That Python is considerably faster in the Round Trip Time test makes the data even more inconclusive yet might indicate a weakness of the JavaScript framewok that still has to be investigated.
These are the findings derived from the methods applied.

## Frame comparison
Both Python and JavaScript send equally big headers on empty messages. Message Data encoding is neither changed by Python nor JavaScript. Thus it is expected, that the network transmission speed is equal.

## Subscribe and connect execution time
Python needed about 70ms (derived from only two points of data, see measurements folder) for establishing a connection whereas NodeJS needed about 50 ms (same lack of data points here). One can conclude that it is likely that JavaScript is about 40% faster in establishing a connection. This information needs to be examined further since insufficient data backs it. However, in determining the speed of a MQTT application, the connection establishing speed is only a minor influence.
The same lack of hard evidence exists in the subscribe execution time.

## Publish time
As the most important metric this has been measured as the total time elapsed to execute 1000 publishes using the max payload. In Python the execution takes 2235 ms in JavaScript only 1.7 ms. It is indicating a major difference. The measurement is to be considered incorrect. The JavaScript call for publishing messages must be asynchronous, thus corrupting the timing. *However:* If time spent by the main thread to execute a publish is critical, JavaScript and MQTT.js is without doubt the better solution!

In order to guess at the transmission speed of JavaScript the tcp-dumps are taken into consideration. Here for 1000 Publishes from JavaScript the last publish arrives after 90ms. After this time the transmission is ended (probably because the script is finished). But only 44 Frames have been sent! Not 1000! If handled uncarefully JavaScript drops frames (which is okay, since QOS is configured to be 0, but must be taken into consideration). For python the last frame arrives after 1887ms. Here no packages are dropped.
(90ms/44*1000 = 2045ms -> were JavaScript to send all packages it would need approximately the same time)

## Round Trip Time
In Round Trip Time python is considerably faster taking only 10ms as opposed to 18ms. This might indicate that the asynchronous task executed by JavaScript Publish is in fact slower than the blocking python method.
