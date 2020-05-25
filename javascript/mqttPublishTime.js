const { PerformanceObserver, performance } = require('perf_hooks');
var mqtt = require('mqtt')
const payloadModule = require('./payloads.js')

// observer for measuring times
const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].name + ";" + list.getEntries()[0].duration + ";" + list.getEntries()[0].startTime);
});
obs.observe({ entryTypes: ['function', 'measure'] });

// configuration
const host="localhost";
const port=1883;
const numberOfPublishes = 1000;
const payload = payloadModule.big;

// connect (blocking)
performance.mark('connecting');
var client  = mqtt.connect("mqtt://" + host + ":" + port);
performance.mark('connected');
performance.measure('connecting to connected', 'connecting', 'connected');

// client events
client.on('connect', function () {
})

client.on('message', function (topic, message) {
  console.log("published to received" + ";" + (now-lastPublishTime).toString() + ";" + now );
})

function subscribe(){
  client.subscribe('payload/empty', function (err) {});
}

// subscribe containing time measurement
function publish(){
  client.publish('payload/payload', payload);
}
// Publish a number of times
//for some reason, the client will not publish at all, if it is not subscribed to anything
subscribe();
performance.mark('publishing');
for(i=0;i<numberOfPublishes;i++){
  publish();
  console.log(i)
}
performance.mark('published');
performance.measure('publishing to published', 'publishing', 'published');

// cleanup
obs.disconnect();
client.end()
