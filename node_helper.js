var https = require("https");

// Replace YOUR_API_KEY with your actual API key.
var apiKey = "YOUR_API_KEY";
var channelId = "UC_CHANNEL_ID";

// Build the API request URL.
var url = "https://www.googleapis.com/youtube/v3/search?key=" + apiKey + "&channelId=" + channelId + "&part=snippet,id&order=date&maxResults=10";

https.get(url, function(res) {
    var body = "";

    res.on("data", function(chunk) {
        body += chunk;
    });

    res.on("end", function() {
        var response = JSON.parse(body);
        var titles = [];

        for (var i = 0; i < response.items.length; i++) {
            titles.push(response.items[i].snippet.title);
        }

        console.log(titles);
    });
}).on("error", function(error) {
    console.log("Error: " + error.message);
});

