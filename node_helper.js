const NodeHelper = require("node_helper");
const https = require("https");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
  apiKey: null,
  channelIds: null,
  updateInterval: null,
  debug: false,
  cacheFile: "localNewsCache.json",
  cacheExpiry: 60 * 60 * 1000, // 1 hour in milliseconds

  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_VIDEO_TITLES") {
      this.apiKey = payload.apiKey;
      this.channelIds = payload.channelIds;
      this.updateInterval = payload.updateInterval;
      this.debug = payload.debug;
      this.cacheFile = path.resolve(__dirname, this.cacheFile);
      this.cacheExpiry = payload.cacheExpiry || this.cacheExpiry;

      // Check if cache file exists and is still valid
      if (fs.existsSync(this.cacheFile)) {
        const stats = fs.statSync(this.cacheFile);
        const now = new Date().getTime();
        const cacheAge = now - stats.mtimeMs;

        if (cacheAge < this.cacheExpiry) {
          console.log("Using cached data");
          const cachedData = fs.readFileSync(this.cacheFile, "utf8");
          const videos = JSON.parse(cachedData);
          this.sendSocketNotification("VIDEO_TITLES", { videos });
          return;
        }
      }

      // If cache is invalid or does not exist, fetch new data
      this.fetchAndUpdateCache();
    }
  },

  fetchAndUpdateCache: function() {
    const self = this;
    const allVideos = [];

    const fetchPromises = this.channelIds.map(channelId => {
      return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${self.apiKey}`;

        https.get(url, function(res) {
          let body = "";

          res.on("data", function(chunk) {
            body += chunk;
          });

          res.on("end", function() {
            try {
              const response = JSON.parse(body);
              if (response.error) {
                console.error("Error response from YouTube API:", response);
                if (response.error.code === 403) {
                  console.error("Quota exceeded. Stopping further requests.");
                }
                reject(response.error);
                return;
              }

              const videos = response.items.map(item => ({
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt
              }));

              if (self.debug) {
                console.log("Fetched videos:", videos);
              }

              allVideos.push(...videos);
              resolve();
            } catch (error) {
              console.error("Error processing response:", error);
              reject(error);
            }
          });

          res.on("error", function(e) {
            console.error("HTTP request error:", e);
            reject(e);
          });
        }).on("error", function(e) {
          console.error("HTTPS request error:", e);
          reject(e);
        });
      });
    });

    Promise.all(fetchPromises)
      .then(() => {
        fs.writeFileSync(self.cacheFile, JSON.stringify(allVideos), "utf8");
        self.sendSocketNotification("VIDEO_TITLES", { videos: allVideos });
      })
      .catch(error => {
        console.error("Error fetching video titles:", error);
      });
  },

  log: function(message) {
    if (this.debug) {
      console.log("MMM-LocalNews: " + message);
    }
  }
});
