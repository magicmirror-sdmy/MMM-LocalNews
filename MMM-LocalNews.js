Module.register("MMM-LocalNews",{
    // Default module config.
    defaults: {
        channelId: "",
        apiKey: "",
        updateInterval: 5 * 60 * 1000, // Every 5 minutes
    },

    // Override the start method.
    start: function() {
        this.getVideoTitles();
        setInterval(function() {
            this.getVideoTitles();
        }.bind(this), this.config.updateInterval);
    },

    // Request the video titles from the node helper.
    getVideoTitles: function() {
        this.sendSocketNotification("GET_VIDEO_TITLES", {
            channelId: this.config.channelId,
            apiKey: this.config.apiKey
        });
    },

    // Handle the video titles received from the node helper.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "VIDEO_TITLES") {
            this.videoTitles = payload.titles;
            this.updateDom();
        }
    },

    // Update the module's DOM to display the video titles.
    updateDom: function() {
        var wrapper = document.createElement("div");

        for (var i = 0; i < this.videoTitles.length; i++) {
            var title = document.createElement("p");
            title.innerHTML = this.videoTitles[i];
            wrapper.appendChild(title);
        }

        this.updateContent(wrapper);
    }
});

