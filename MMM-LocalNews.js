Module.register("MMM-LocalNews", {
  css: ["MMM-LocalNews.css"],

  defaults: {
    apiKey: "",
    channelIds: [],
    displayTime: 10000, // 10 seconds in milliseconds
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
    this.isDisplayingVideo = false;
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
    const now = new Date();
    const sixHoursAgo = now.getTime() - 6 * 60 * 60 * 1000;

    this.videos = this.videos.filter(video => {
      const videoTime = new Date(video.publishedAt).getTime();
      return videoTime >= sixHoursAgo &&
        !this.config.excludedTitles.some(excluded =>
          video.title.toLowerCase().includes(excluded.toLowerCase())
        );
    });

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

      var timeDiv = document.createElement("div");
      timeDiv.className = "newsfeed-time small dimmed";
      timeDiv.innerHTML = this.formatTimeAgo(this.currentVideo.publishedAt);
      newsDiv.appendChild(timeDiv);

      wrapper.appendChild(newsDiv);
    } else {
      wrapper.innerHTML = "Loading...";
    }

    return wrapper;
  },

  showNextVideo: function() {
    var self = this;

    if (this.isDisplayingVideo) {
      this.log("Skipping showNextVideo call to avoid duplicate execution.");
      return;
    }

    this.isDisplayingVideo = true;

    if (this.videos.length === 0) {
      this.currentVideo = { title: "No more titles.", channelTitle: "" };
      this.updateDom();
      this.isDisplayingVideo = false;
      return;
    }

    this.currentVideo = this.videos[this.titleIndex];
    this.updateDom();

    this.titleIndex++;
    if (this.titleIndex >= this.videos.length) {
      this.titleIndex = 0;
    }

    setTimeout(function() {
      self.isDisplayingVideo = false;
      self.showNextVideo();
    }, this.config.displayTime);
  },

  scheduleNextUpdate: function() {
    var self = this;
    setInterval(function() {
      self.fetchAndUpdateCache();
    }, this.config.updateInterval);
  },

  formatTimeAgo: function(dateString) {
    const now = new Date();
    const videoDate = new Date(dateString);
    const diffMs = now - videoDate;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours} hours ${remainingMinutes} minutes ago`;
    } else {
      return `${minutes} minutes ago`;
    }
  },

  log: function(message) {
    if (this.config.debug) {
      Log.info("MMM-LocalNews: " + message);
    }
  }
});
