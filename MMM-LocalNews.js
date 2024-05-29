Module.register("MMM-LocalNews", {
  css: ["MMM-LocalNews.css"],

  defaults: {
    apiKey: "",
    channelIds: [],
    displayTime: 5000,
    updateInterval: 10 * 60 * 1000,
    debug: false,
    excludedTitles: []
  },

  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
    var self = this;
    this.titleIndex = 0; // Initialize title index
    this.updateIntervalCount = 0; // Initialize update interval count
    this.intervalId = setInterval(function() {
      self.sendSocketNotification("GET_VIDEO_TITLES", self.config);
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      clearInterval(this.intervalId);

      this.videos = payload.videos.filter(video => !this.config.excludedTitles.some(excluded => video.title.toLowerCase().includes(excluded.toLowerCase())));
      if (this.videos.length === 0) {
        this.currentVideo = { title: "No relevant news found.", channelTitle: "" };
      } else {
        this.titleIndex = 0; // Reset title index when new data arrives
        this.showNextVideo();
      }
      this.updateDom();

      var self = this;
      this.intervalId = setInterval(function() {
        self.sendSocketNotification("GET_VIDEO_TITLES", self.config);
      }, this.config.updateInterval);
    }
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
  }
});
