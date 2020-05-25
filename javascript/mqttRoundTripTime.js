const { PerformanceObserver, performance } = require('perf_hooks');
var mqtt = require('mqtt')
const payloadModule = require('./payloads.js')
// observer for measuring times
const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].name + ";" + list.getEntries()[0].duration + ";" + list.getEntries()[0].startTime);
});
obs.observe({ entryTypes: ['function', 'measure'] });

// configuration
const host="localhost"
const port=1883
const payload = payloadModule.big;

performance.mark('connecting');
var client  = mqtt.connect('mqtt://localhost:1883');
performance.mark('connected');
performance.measure('connecting to connected', 'connecting', 'connected');

// client events
client.on('connect', function () {

})

// This is a workaround as for some reasen performance.mark does not work in client.on('message')
let lastPublishTime = 0;
client.on('message', function (topic, message) {
  let now = performance.now();
  console.log("published to received" + ";" + (now-lastPublishTime).toString() + ";" + now );
})

// subscribe containing time measurement
function subscribe(){
  performance.mark('subscribing');
  client.subscribe('payload/empty', function (err) {});
  performance.mark('subscribed');
  performance.measure('subscribing to subscribed', 'subscribing', 'subscribed');
}

// subscribe containing time measurement
function publish(){
  performance.mark('publishing');

  client.publish('payload/empty', payload);
  performance.mark('published');
  lastPublishTime = performance.now();
  performance.measure('publishing to published', 'publishing', 'published');
}

// Subscribe to a single topic and publish a msg
subscribe();
publish();


// cleanup
obs.disconnect();
client.end()
