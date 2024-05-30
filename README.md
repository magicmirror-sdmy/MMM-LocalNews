# MMM-LocalNews
Magicmirror module to extract the data from YouTube titles and display it as newsfeed on the mirror
This project was created using chatgpt giving it precise directions. 
It uses youtube api to extract video titles from youtube channel and display it as news feed. 
This module does not work yet and needs changes. 
Git clone this repository in your modules folder.
run npm install in the MMM-LocalNews directory.

``` 
    git clone https://github.com/sdmydbr9/MMM-LocalNews.git
    cd MMM-LocalNews
    npm install
```
Add you config in the config.js
``` 
    {
  module: "MMM-LocalNews",
  position: "top_right",
  config: {
    apiKey: "YOUR_YOUTUBE_API_KEY",
    channelIds: ["UC_x5XG1OV2P6uZZ5FSM9Ttw", "UCYfdidRxbB8Qhf0Nx7ioOYw"],
    displayTime: 5000, // Display each news title for 5 seconds
    updateInterval: 10 * 60 * 1000, // Update every 10 minutes
    debug: true, // Enable debug mode
    excludedTitles: ["live", "breaking news"], // Exclude titles containing "live" or "breaking news"
    cacheFile: "localNewsCache.json", // Cache file for storing fetched data
    cacheExpiry: 60 * 60 * 1000 // Cache expiry time: 1 hour
  }
}


```

Replace your api key with a valid api key obtained from google developer console and replace the YouTube channel id 
