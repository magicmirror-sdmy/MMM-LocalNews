# MMM-LocalNews
Magicmirror module to extract the data from YouTube titles and display it as newsfeed on the mirror
This project was created using chatgpt giving it precise directions. 
It uses youtube api to extract video titles from youtube channel and display it as news feed. 
This module does not work yet and needs changes. 
Git clone this repository in your modules folder.
run npm install in the MMM-LocalNews directory.


## Features

- Fetches news titles from specified YouTube channels.
- Displays each news title for a specified duration.
- Filters out unwanted titles based on user-defined keywords.
- Caches news data to reduce API calls and avoid exceeding the YouTube API quota.


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

## Obtaining an api key
- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project or select an existing project.
- Navigate to the "APIs & Services" > "Dashboard".
- Click "Enable APIs and Services".
- Search for "YouTube Data API v3" and enable it.
- Go to "Credentials" and click "Create Credentials".
- Select "API Key" and copy the generated key. This is your apiKey.


  ## Finding YouTube Channel IDs
  - Go to the YouTube channel you want to add.
  - Click on the channel name to go to their main page.
  - Look at the URL of the channel. It will be in one of the following formats:
  - - `https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw`
    - `https://www.youtube.com/user/username`
  - If the URL is in the format /channel/, the string after /channel/ is the Channel ID.
  - If the URL is in the format /user/, you need to use the YouTube Data API to find the Channel ID from the username.
 

    ## Usage
     - Start your MagicMirror².
     - The module will fetch and display the latest news titles from the specified YouTube channels.
     - Titles containing specified keywords (e.g., "live") will be excluded from display.
   

    ## Troubleshooting
    - Ensure you have a valid YouTube API key and have not exceeded your quota.
    - Check the console logs for any error messages if the module is not working as expected.
    - Enable debug mode in the configuration to see more detailed logs.

    ## Contributing
    Contributions are welcome! Please fork the repository and submit a pull request with your changes.
  


Replace your api key with a valid api key obtained from google developer console and replace the YouTube channel id 
