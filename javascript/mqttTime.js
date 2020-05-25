const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].name + ";" + list.getEntries()[0].duration + ";" + list.getEntries()[0].startTime);
});
obs.observe({ entryTypes: ['function', 'measure'] });

var mqtt = require('mqtt')
performance.mark('connecting');
var client  = mqtt.connect('mqtt://localhost:1883');
// client events
client.on('connect', function () {
  performance.mark('connected');
  performance.measure('connecting to connected', 'connecting', 'connected');
  takeMeasurements();
})

// This is a workaround as for some reasen performance.mark does not work in client.on('message')
let lastPublishTime = 0;
client.on('message', function (topic, message) {
  let now = performance.now()
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
  client.publish('payload/empty', '');
  performance.mark('published');
  lastPublishTime = performance.now();
  performance.measure('publishing to published', 'publishing', 'published');
}

function takeMeasurements(){
  // Subscribe to a single topic
  subscribe();

  // Publish a number of times
  for(i=0;i<10;i++){
    publish();
  }

  // cleanup
  obs.disconnect();
  client.end()
}
