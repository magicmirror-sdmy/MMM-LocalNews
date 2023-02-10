var NodeHelper = require("node_helper");
var https = require("https");

module.exports = NodeHelper.create({

  // Override start method.
  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  // Handle the GET_VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VIDEO_TITLES") {
      var apiKey = payload.apiKey;
      var urls = payload.urls;
      var hours = payload.hours;
      var debug = payload.debug;
      
      var titles = [];

      urls.forEach(function(url) {
        var channelId = url.substring(url.lastIndexOf("/") + 1);
        var publishedAfter = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&publishedAfter=${publishedAfter}&maxResults=50&order=date&type=video&key=${apiKey}`;
        var nodeHelper = this; // store a reference to the node helper

        https.get(url, function(res) {
          var body = "";

          res.on("data", function(chunk) {
            body += chunk;
          });

          res.on("end", function() {
            var response = JSON.parse(body);

            for (var i = 0; i < response.items.length; i++) {
              titles.push(response.items[i].snippet.title);
            }
          });
        });
      });

      setTimeout(function() {
        // Log the titles to the console if debug is enabled.
        if (debug) {
          console.log("Titles: " + titles);
        }
  
        // Send the video titles back to the module.
        nodeHelper.sendSocketNotification("VIDEO_TITLES", { titles: titles });
      }, 2000);
    }
  }
});