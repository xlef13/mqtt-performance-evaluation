var mqtt = require('mqtt')
const { PerformanceObserver, performance } = require('perf_hooks');
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
var client  = mqtt.connect(host + ":" + port);
performance.mark('connected');
performance.measure('connecting to connected', 'connecting', 'connected');
// client events
client.on('connect', function () {
  //start taking the actual measurements after connection is aknowledged

})

client.on('message', function (topic, message) {
  console.log("published to received" + ";" + (now-lastPublishTime).toString() + ";" + now );
})

// subscribe containing time measurement
function publish(){
  client.publish('payload/empty', payload);
}

// Publish a number of times
performance.mark('publishing');
for(i=0;i<numberOfPublishes;i++){
  publish();
}
performance.mark('published');
performance.measure('publishing to published', 'publishing', 'published');
// cleanup
obs.disconnect();
client.end()
