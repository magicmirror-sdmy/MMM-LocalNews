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
   config: {
    apiKey: "YOUR_API_KEY",
    urls: [
        "https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ",
        "https://www.youtube.com/channel/UCQG5SdM5j5x5Ln1lOf2QQFg"
          ],
    hours: 24,
    displayTime: 5000,
    debug: false
              }
    },

```

Replace your api key with a valid api key obtained from google developer console and replace the YouTube channel id 
