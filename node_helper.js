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
      var channelId = payload.channelId;
      var debug = payload.debug;

      if (!apiKey || !channelId) {
        return console.error("apiKey and channelId must be provided");
      }

      var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`;
      var self = this; // store a reference to the node helper

      https.get(url, function(res) {
        var body = "";

        res.on("data", function(chunk) {
          body += chunk;
        });

        res.on("end", function() {
          var response = JSON.parse(body);

          if (!response || !response.items) {
            return console.error("Could not get video titles. Invalid response from YouTube API");
          }

          var titles = [];

          for (var i = 0; i < response.items.length; i++) {
            titles.push(response.items[i].snippet.title);
          }

          // Log the titles to the console if debug is enabled.
          if (debug) {
            console.log("Titles: " + titles);
          }

          // Send the video titles back to the module.
          self.sendSocketNotification("VIDEO_TITLES", { titles: titles });
        });
      });
    }
  }
});