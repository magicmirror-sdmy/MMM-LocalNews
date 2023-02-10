Module.register("MMM-LocalNews", {
  // Default module config.
  defaults: {
    apiKey: "",
    channelId: ""
  },

  // Member variable to store the video titles.
  html: "",

  // Override start method.
  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
  },

  // Handle the VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      var titles = payload.titles;

      this.html = "<ul>";
      for (var i = 0; i < titles.length; i++) {
        this.html += "<li>" + titles[i] + "</li>";
      }
      this.html += "</ul>";

      this.updateDom();
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.html;
    return wrapper;
  }
});
