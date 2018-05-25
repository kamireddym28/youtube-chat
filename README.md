# Youtube Live Streaming With Chat Stats Project

 > This project is intended to create a webapp that allows users to login with their Google/Youtube credentials to login and join a live stream. Once in the stream, it should stream all chat messages and update live. Store these messages and create another interface that will return all chat messages from a given username.
 
## Frameworks and APIs

 - Google API
 - Youtube API
 - jQuery
 - Bootstrap

## Usage

 - [Download](https://github.com/kamireddym28/youtube-chat.git) or clone the repo. 
 - Create a new project under Dashboard in GoogleAPI console.
 - Switch to OAuth Consent Screen tab and select Web application by naming the app.
 - Obtain Client ID for this app and replace it **index.html** file.
 - Authorize JavaScript origins with http://localhost:8000.
 - Start the server by running ```python -m http.server 8000``` in the project path where it was cloned.
 - Ensure proper running of app by checking at port 8000 using http://localhost:8000 in your browser.
 
## Description of files
 - **index.html** -- Basic structuring of web page. Implemented using bootstrap. Replace the client id obtained from Google API with personal API key. 
 - **css/styles.css** -- Contains the styling that makes app appear aesthetically.
 - **css/reset.css** -- Normalized CSS style file which can be found online.
 - **js/main.js** -- Functionality needed to build the search-string, build and display video, build and display livechat, filter the chat based on user name and 
					 chat frequency in an interval can be found here. Used Youtube search API to obtain information.
 - **js/auth.js** -- Functionality needed to execute sign-in and sign-out can be seen here.
 - **js/stats.js** -- Functionality needed to display the chat statistics using Canvas JS can be found here.

## Reference Material 
 - Youtube API documentation found online.
 - Canvas JS tutorial can be found [here](https://canvasjs.com/docs/charts/basics-of-creating-html5-chart/updating-chart-options/).
 


