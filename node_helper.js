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
      var channelIds = payload.channelId;
      var debug = payload.debug;
      var titles = [];

      // Function to fetch the video titles for a single channel ID.
      function fetchTitlesForChannel(channelId) {
        var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`;
        var self = this; // store a reference to the node helper

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

            // Log the titles to the console if debug is enabled.
            if (debug) {
              console.log("Titles for channel " + channelId + ": " + titles);
            }

            // If all channels have been processed, send the video titles back to the module.
            if (channelIds.length === 0) {
              self.sendSocketNotification("VIDEO_TITLES", { titles: titles });
            }
          });
        });
      }

      // Fetch the video titles for each channel ID.
      channelIds.forEach(function(channelId) {
        fetchTitlesForChannel(channelId);
      });
    }
  }
});
