Module.register("MMM-LocalNews", {
    // Default module config.
    defaults: {
        channelId: "UCX6OQ3DkcsbYNE6H8uQQuVA",
        apiKey: "YOUR_API_KEY",
        updateInterval: 60 * 60 * 1000, // Every hour.
        animationSpeed: 2 * 1000,
        initialLoadDelay: 0,
        retryDelay: 2500,
        maxTitles: 10,
        reverse: false
    },

    // Define required scripts.
    getScripts: function() {
        return [];
    },

    // Define required styles.
    getStyles: function() {
        return [
            "MMM-LocalNews.css"
        ];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.config = Object.assign({}, this.defaults, config);

        this.videoTitles = [];
        this.scheduleUpdate();
    },

    // Override the getDom method.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "video-titles";

        if (!this.videoTitles.length) {
            wrapper.innerHTML = "Loading video titles...";
            wrapper.classList.add("bright", "light");
            return wrapper;
        }

        if (this.config.reverse) {
            this.videoTitles.reverse();
        }

        this.videoTitles.forEach(function(videoTitle) {
            var title = document.createElement("div");
            title.className = "video-title";
            title.innerHTML = videoTitle;
            wrapper.appendChild(title);
        });

        return wrapper;
    },

    // Request video titles from the node helper.
    scheduleUpdate: function() {
        setTimeout(function() {
            this.sendSocketNotification("GET_VIDEO_TITLES", {
                channelId: this.config.channelId,
                apiKey: this.config.apiKey
            });
        }.bind(this), this.config.initialLoadDelay);

        setInterval(function() {
            this.sendSocketNotification("GET_VIDEO_TITLES", {
                channelId: this.config.channelId,
                apiKey: this.config.apiKey
            });
        }.bind(this), this.config.updateInterval);
    },

    // Handle the video titles received from the node helper.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "VIDEO_TITLES") {
            this.videoTitles = payload.titles.slice(0, this.config.maxTitles);
            this.updateDom(this.config.animationSpeed);
        }
    }
});
