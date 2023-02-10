var https = require("https");

module.exports = NodeHelper.create({

  // Override start method.
  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  // Handle the GET_VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VIDEO_TITLES") {
      var apiKey = this.config.apiKey;
      var channelId = this.config.channelId;

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

          // Send the video titles back to the module.
          this.sendSocketNotification("VIDEO_TITLES", { titles: titles });
        }.bind(this));
      }.bind(this)).on("error", function(error) {
        console.log("Error: " + error.message);
      });
    }
  }
});
