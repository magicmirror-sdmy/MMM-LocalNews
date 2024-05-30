Module.register("MMM-LocalNews", {
  css: ["MMM-LocalNews.css"],

  defaults: {
    apiKey: "",
    channelIds: [],
    displayTime: 5000,
    updateInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
    debug: false,
    excludedTitles: [],
    cacheFile: "localNewsCache.json",
    cacheExpiry: 60 * 60 * 1000 // 1 hour in milliseconds
  },

  start: function() {
    this.log("Starting module");
    this.titleIndex = 0;
    this.videos = [];
    this.currentVideo = null;
    this.fetchAndUpdateCache();
    this.scheduleNextUpdate();
  },

  fetchAndUpdateCache: function() {
    this.log("Fetching new data from API");
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      this.videos = payload.videos;
      this.filterAndShowVideos();
    }
  },

  filterAndShowVideos: function() {
    this.videos = this.videos.filter(video =>
      !this.config.excludedTitles.some(excluded =>
        video.title.toLowerCase().includes(excluded.toLowerCase())
      )
    );

    if (this.videos.length === 0) {
      this.currentVideo = { title: "No relevant news found.", channelTitle: "" };
    } else {
      this.titleIndex = 0;
      this.showNextVideo();
    }

    this.updateDom();
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-LocalNews";

    if (this.currentVideo) {
      var newsDiv = document.createElement("div");
      newsDiv.className = "newsfeed";

      var sourceDiv = document.createElement("div");
      sourceDiv.className = "newsfeed-source dimmed small";
      sourceDiv.innerHTML = this.currentVideo.channelTitle;
      newsDiv.appendChild(sourceDiv);

      var titleDiv = document.createElement("div");
      titleDiv.className = "newsfeed-title bright medium";
      titleDiv.innerHTML = this.currentVideo.title;
      newsDiv.appendChild(titleDiv);

      wrapper.appendChild(newsDiv);
    } else {
      wrapper.innerHTML = "Loading...";
    }

    return wrapper;
  },

  showNextVideo: function() {
    var self = this;

    if (this.videos.length === 0) {
      this.currentVideo = { title: "No more titles.", channelTitle: "" };
      this.updateDom();
      return;
    }

    this.currentVideo = this.videos[this.titleIndex];
    this.updateDom();

    this.titleIndex++;
    if (this.titleIndex >= this.videos.length) {
      this.titleIndex = 0;
    }

    setTimeout(function() {
      self.showNextVideo();
    }, this.config.displayTime);
  },

  scheduleNextUpdate: function() {
    var self = this;
    setInterval(function() {
      self.fetchAndUpdateCache();
    }, this.config.cacheExpiry);
  },

  log: function(message) {
    if (this.config.debug) {
      Log.info("MMM-LocalNews: " + message);
    }
  }
});
