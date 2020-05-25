var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('payload/empty', function (err) {
    if (!err) {
      client.publish('payload/empty', '');
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
