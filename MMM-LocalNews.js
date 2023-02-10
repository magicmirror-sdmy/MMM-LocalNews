Module.register("MMM-LocalNews", {
  // Default module config.
  defaults: {
    apiKey: "",
    channelId: "",
    updateInterval: 3600000, // Default update interval is 1 hour (in milliseconds)
    displayTime: 5000, // Default display time is 5 seconds
    debug: false // Default value for debug is false
  },

  // Override start method.
  start: function() {
    this.getVideoTitles();
    setInterval(this.getVideoTitles.bind(this), this.config.updateInterval);
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
  },

  // Get the video titles from the API.
  getVideoTitles: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
  }
});
