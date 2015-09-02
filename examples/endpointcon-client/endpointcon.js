var DDPClient = require('ddp-client');

var ddpclient = new DDPClient({
    host : '127.0.0.1',
    port : 3000,
});

/*
 * Connect to the Meteor Server
 */
ddpclient.connect(function(error, wasReconnect) {

    /*
     * Subscribe to a Meteor Collection
     */
    ddpclient.subscribe('sensorvalues', [], function() {
        console.log(ddpclient.collections.sensorvalues);
    });

    /*
     * Observe a collection.
     */
    var observer = ddpclient.observe('sensorvalues');
    observer.changed = function(id, oldFields, clearedFields, newFields) {
        if (id == 0) {
            document.getElementById('date').textContent = newFields.value
        }
        if (id == 1) {
            document.getElementById('ping').textContent = newFields.value
        }
        if (id == 2) {
            document.getElementById('cpu').textContent = newFields.value
        }
        if (id == 3) {
            document.getElementById('clicks').textContent = newFields.value
        }
    };

    /*
     * Send a remote procedure call
     */
    document.getElementById('addclick').addEventListener('click', function() {
        ddpclient.call('click');
    });
});
