 var NodeHelper = require("node_helper");
var https = require("https");

module.exports = NodeHelper.create({
  apiKey: null,
  channelIds: null,
  updateInterval: null,
  debug: false,
  intervalId: null,
  cache: {},

  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VIDEO_TITLES") {
      clearInterval(this.intervalId);
      this.apiKey = payload.apiKey;
      this.channelIds = payload.channelIds;
      this.updateInterval = payload.updateInterval;
      this.debug = payload.debug;
      this.getData();
    }
  },

  getData: function() {
    if (!this.channelIds) {
      return;
    }

    var self = this;
    this.channelIds.forEach(function(channelId) {
      var cacheKey = `channel_${channelId}`;
      var cachedData = self.cache[cacheKey];

      // Check if the data is in cache and still valid
      if (cachedData && (Date.now() - cachedData.timestamp < self.updateInterval)) {
        console.log(`Using cached data for channel: ${channelId}`);
        self.sendSocketNotification("VIDEO_TITLES", cachedData.data);
        return;
      }

      var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${self.apiKey}`;

      https.get(url, function(res) {
        var body = "";

        res.on("data", function(chunk) {
          body += chunk;
        });

        res.on("end", function() {
          try {
            var response = JSON.parse(body);
            if (response.error) {
              console.error('Error response from YouTube API:', response);
              if (response.error.code === 403) {
                console.error('Quota exceeded. Stopping further requests.');
                clearInterval(self.intervalId);
              }
              return;
            }

            var videos = [];
            if (response.items && Array.isArray(response.items)) {
              for (var i = 0; i < response.items.length; i++) {
                videos.push({
                  title: response.items[i].snippet.title,
                  channelTitle: response.items[i].snippet.channelTitle
                });
              }
            } else {
              console.error('Unexpected response format:', response);
            }

            if (self.debug) {
              console.log("Videos: ", videos);
            }

            var payload = {
              videos: videos,
              channelId: channelId
            };

            // Cache the data
            self.cache[cacheKey] = {
              timestamp: Date.now(),
              data: payload
            };

            self.sendSocketNotification("VIDEO_TITLES", payload);
          } catch (error) {
            console.error("Error processing response:", error);
          }
        });

        res.on("error", function(e) {
          console.error("HTTP request error:", e);
        });
      }).on("error", function(e) {
        console.error("HTTPS request error:", e);
      });
    });

    this.intervalId = setTimeout(function() {
      self.getData();
    }, this.updateInterval);
  }
});
