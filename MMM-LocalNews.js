const moment = window.moment;

Module.register("MMM-LocalNews", {
  // Default module config.
  defaults: {
    apiKey: "",
    channelId: ""
  },

  // Override start method.
  start: function() {
    this.sendSocketNotification("GET_VIDEO_TITLES", this.config);
  },

  // Handle the VIDEO_TITLES socket notification.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "VIDEO_TITLES") {
      var titles = payload.titles;

      var html = "<ul>";
      for (var i = 0; i < titles.length; i++) {
        html += "<li>" + titles[i] + "</li>";
      }
      html += "</ul>";

      this.updateDom();
    }
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    return wrapper;
  }
});
