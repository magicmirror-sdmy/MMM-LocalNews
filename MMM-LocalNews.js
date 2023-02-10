Module.register("MMM-LocalNews", {
  // Default module config.
  defaults: {
    apiKey: "",
    channelId: "",
    displayTime: 5000, // Default display time is 5 seconds
    debug: false
  },

  // Override start method.
  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
  },

  // Handle the VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      this.titles = payload.titles;
      this.updateDom();

      if (this.config.debug) {
        console.log("Video Titles:", this.titles);
      }

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
