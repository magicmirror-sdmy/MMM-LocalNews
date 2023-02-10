var NodeHelper = require("node_helper");
var https = require("https");
var cache = require("memory-cache");

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
      var cacheKey = `videoTitles_${channelId}`;

      // Check if the video titles are already cached.
      var videoTitles = cache.get(cacheKey);
      if (videoTitles) {
        if (debug) {
          console.log("Titles retrieved from cache");
        }
        this.sendSocketNotification("VIDEO_TITLES", { titles: videoTitles });
        return;
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
          var titles = [];

          for (var i = 0; i < response.items.length; i++) {
            titles.push(response.items[i].snippet.title);
          }

          // Log the titles to the console if debug is enabled.
          if (debug) {
            console.log("Titles: " + titles);
          }

          // Store the video titles in cache for 1 hour.
          cache.put(cacheKey, titles, 60 * 60 * 1000);

          // Send the video titles back to the module.
          self.sendSocketNotification("VIDEO_TITLES", { titles: titles });
        });
      });
    }
  }
});
