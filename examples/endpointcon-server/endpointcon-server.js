var DDPServer = require('ddp-server-reactive');
var exec = require('child_process').exec;

// Create a server listening on the default port 3000
var server = new DDPServer();

// Create a reactive collection
// All the changes below will automatically be sent to subscribers
var sensorvalues = server.publish("sensorvalues");

// Add items
sensorvalues[0] = { title: "Time", value: new Date() };
sensorvalues[1] = { title: "Ping", value: 0 };

// Change items
setInterval(function() {
    sensorvalues[0].value = new Date();
    exec("ping -c 1 google.com", function (error, stdout, stderr) { 
        console.log(error, stdout, stderr);
        sensorvalues[1].value = stdout 
    });
}, 3000);

// Add methods
server.methods({
  test: function() {
    return true;
  }
});
