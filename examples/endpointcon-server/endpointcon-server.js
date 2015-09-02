var DDPServer = require('ddp-server-reactive');
var exec = require('child_process').exec;
var cpu = require('cpu-load');

// Create a server listening on the default port 3000
var server = new DDPServer();

// Create a reactive collection
// All the changes below will automatically be sent to subscribers
var sensorvalues = server.publish('sensorvalues');

// Add items
sensorvalues[0] = {title: 'Time', value: new Date()};
sensorvalues[1] = {title: 'Ping', value: 0};
sensorvalues[2] = {title: 'CPU', value: 0};
sensorvalues[3] = {title: 'Clicks', value: 0};

// Change items
setInterval(function() {
    sensorvalues[0].value = new Date();
    exec('ping -c 1 google.com', function(error, stdout, stderr) {
        console.log(error, stdout, stderr);
        sensorvalues[1].value = stdout;
    });
    cpu(1000, function(load) {
        sensorvalues[2].value = load;
    });
}, 3000);

// Add methods
server.methods({
    click: function() {
        sensorvalues[3].value++;
        return true;
    }
});
