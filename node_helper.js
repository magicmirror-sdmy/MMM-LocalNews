var NodeHelper = require("node_helper");
var https = require("https");

module.exports = NodeHelper.create({
  // Override start method.
  start: function() {
    console.log("Starting node helper for: " + this.name);
    this.updateInterval = null;
  },

  // Handle the GET_VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VIDEO_TITLES") {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }

      var apiKey = payload.apiKey;
      var channelId = payload.channelId;
      var displayTime = payload.displayTime;
      var updateInterval = payload.updateInterval;
      var debug = payload.debug;

      var self = this; // store a reference to the node helper

      this.updateInterval = setInterval(function() {
        var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${apiKey}`;

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

            // Send the video titles back to the module.
            self.sendSocketNotification("VIDEO_TITLES", { titles: titles });
          });
        });
      }, updateInterval);
    }
  }
});
