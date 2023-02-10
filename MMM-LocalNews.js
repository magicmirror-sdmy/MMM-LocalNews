const moment = window.moment;

Module.register("MMM-LocalNews", {
  // Default module config.
  defaults: {
    apiKey: "",
    channelId: "",
    refreshInterval: 5 * 1000
  },

  // Override start method.
  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);

    // Refresh the titles every refreshInterval milliseconds.
    setInterval(() => {
      this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
    }, this.config.refreshInterval);
  },

  // Handle the VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      this.titles = payload.titles;
      this.titleIndex = 0;
      this.updateDom();
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.titles[this.titleIndex];
    this.titleIndex = (this.titleIndex + 1) % this.titles.length;
    return wrapper;
  }
});
