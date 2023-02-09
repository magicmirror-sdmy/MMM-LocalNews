# MMM-LocalNews
Magicmirror module to extract the data from YouTube titles and display it as newsfeed on the mirror
This project was created using chatgpt giving it precise directions. 
It uses youtube api to extract video titles from youtube channel and display it as news feed. 
This module does not work yet and needs changes. 
Git clone this repository in your modules folder.
run npm install in the MMM-LocalNews directory.
add the following lines in your config
```
{
    module: "MMM-LocalNews",
    position: "top_left",
    config: {
        channelId: "UCsT0YIqwnpJCM-mx7-gSA4Q", // Replace this with your YouTube channel ID
        apiKey: "YOUR_API_KEY", // Replace this with your YouTube API key
        updateInterval: 5 * 60 * 1000 // Every 5 minutes
    }
}, 
```

