Module.register("MMM-LocalNews", {
  css: [    "MMM-LocalNews.css"  ],
  // Default module config.
  defaults: {
    apiKey: "",
    channelIds: [], // array of channel ids
    displayTime: 5000, // Default display time is 5 seconds
    updateInterval: 10 * 60 * 1000, // Default update interval is 10 minutes
    debug: false // Default value for debug is false
  },

  // Override start method.
  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);

    // set an interval to update the video titles
    var self = this;
    setInterval(function() {
      self.sendSocketNotification("GET_VIDEO_TITLES", self.config);
    }, this.config.updateInterval);
  },

  // Handle the VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      this.titles = payload.titles;
      this.updateDom();

      this.showNextTitle();
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.currentTitle || "Loading...";
    return wrapper;
  },

  // Show the next title in the list.
  showNextTitle: function() {
    if (this.titles.length === 0) {
      return;
    }

    this.currentTitle = this.titles.shift();
    this.updateDom();

    setTimeout(this.showNextTitle.bind(this), this.config.displayTime);
  }
});
