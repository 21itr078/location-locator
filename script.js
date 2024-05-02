$(document).ready(function() {
    if ("geolocation" in navigator) {
        $('#logButton').click(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                $('#latitude').text(latitude.toFixed(6));
                $('#longitude').text(longitude.toFixed(6));
                $('#timestamp').text(getCurrentTimestamp()); // Update timestamp

                sendDataToThingSpeak(latitude, longitude);
            }, function(error) {
                alert('Error occurred: ' + error.message);
            });
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }

    fetchThingSpeakData();
});

function getCurrentTimestamp() {
    var now = new Date();
    var timestamp = now.toLocaleString(); // Format date and time
    return timestamp;
}

function sendDataToThingSpeak(latitude, longitude) {
    var apiUrl = "https://api.thingspeak.com/update?api_key=CN6SA8TU40A9D1YT&field1=" + latitude + "&field2=" + longitude;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function(response) {
            console.log('Data sent to ThingSpeak successfully.');

            // Display ThingSpeak chart
            displayThingSpeakChart();
        },
        error: function(error) {
            console.log('Error sending data to ThingSpeak: ' + error);
        }
    });
}

function fetchThingSpeakData() {
    var apiUrl = "https://api.thingspeak.com/channels/2517667/feeds.json?api_key=3745UQKI11GEGH3U&results=1";

    $.getJSON(apiUrl, function(data) {
        var feeds = data.feeds;
        if (feeds.length > 0) {
            var latestData = feeds[0];
            $('#tsLatitude').text(latestData.field1);
            $('#tsLongitude').text(latestData.field2);
            var timestamp = new Date(latestData.created_at).toLocaleString(); // Change format as needed

            $('#tsTimestamp').text(timestamp);
        } else {
            console.log('No data available from ThingSpeak.');
        }
    });
}

function displayThingSpeakChart() {
    var iframe = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2517667/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>';
    $('#thingSpeakChart').html(iframe);
}
