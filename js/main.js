function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
  $('#buttons').show();
}

// function to search youtube videos based on search string
$("#search-button").on("click", function(){
  $('#all-videos').empty();
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    type: 'video',
    eventType: 'live',
    maxResults: '20',
    part: 'snippet'
  });

  request.execute(function(response) {
      var videos = response.result.items;
      videos.forEach(function(item) {
        buildVideo(item);
      })
    });
})

//function to play a youtube video
function clickVideo(v1) {
  $('#all-videos').hide();
  $('#buttons').hide();
  $('#live-video').show();
  if($('#chat-stats').length>0) {
    $('#chat-stats').remove();
  }
  var frame = $('<div>').addClass('insert-video col-sm-8 col-md-8');
  var vframe = $('<iframe>').attr('src', `https://www.youtube.com/embed/${v1.id.videoId}?autoplay=1`);
  var vstats = $('<div>').attr('id', 'chat-stats').addClass('chartContainer col-sm-4 col-md-4');
    vframe.attr('allowfullscreen');
    vframe.attr('frameborder', '0');
    vframe.width(825);
    vframe.height(475);
  let = chatData = [];

  $('#live-video').append(frame).append(vstats).append(back);
  $('#chat-stats').show();
  updateStats = stats();
  var vTitle = $('<h2>').addClass('insert-video-title').text(v1.snippet.title);
  frame.append(vTitle).append(vframe);
  setInterval(function() {
    getLiveChat(v1.id.videoId);
    setTimeout(function() {
      buildChat(chatData);
      $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
    }, 1500);
    var s = getStats(chatData);
    updateStats(s);
  }, 10000);

  // function to filter messages from a particular user
  var chatBotOutline = $('<div>').addClass('chatbot-outline col-sm-5 col-md-5');
  var chatBotSearch = $('<div>').attr('id', 'chat-bot');
  var searchBar = $('<h4>').addClass('search-bar').text('Search Live Chat by Username');
  var searchUser = $('<input>').attr('id', 'chat-user').addClass('search-user form-control input');
  var searchButton = $('<button>').attr('id', 'user-search').addClass('search-button btn btn-danger').text('Find User');
  searchUser.attr('placeholder', 'Username');

  searchButton.on('click', function() {
       let userName = $('#chat-user').val();
       $('.search-results').empty();
       let searchResults = chatData.filter(message => message.channelName === userName);
       buildSearchResult(searchResults);
    })
    chatBotSearch.append(searchBar);
    chatBotSearch.append(searchUser);
    chatBotSearch.append(searchButton);

  // function to return to the previous page
   var back = $('<button>').addClass('back-btn btn btn-danger').text('Previous Page');
       back.on('click', function() {
         $('#live-video').empty();
         $('#buttons').show();
         $('#live-video').hide();
         $('#chat-stats').empty();
         $('#chat-stats').hide();
         $('#all-videos').show();
         chatData = [];
       });
   chatBotOutline.append(chatBotSearch);
   $('#live-video').append(frame).append(chatBotOutline).append(back);
}

// function to show the messages from a particular user
function buildSearchResult(searchResults) {
  var searchResult = $('<div>').addClass('search-results col-sm-12 col-md-12');
  var header = $('<h4>').addClass('search-result-header');
  header.text(`There are ${searchResults.length} messages from ${searchResults[0].channelName}.`);
  searchResult.append(header);
  searchResults.forEach(function(result) {
    const msg = $('<div>').addClass('search-msg');
    const timestamp = $('<div>').addClass('search-msg-timestamp col-sm-3 col-md-3');
    timestamp.text(getTimeFormat(result.publishedAt));
    var msgContent = $('<div>').addClass('search-msg-content col-sm-9 col-md-9');
    msgContent.text(result.displayMessage);

    msg.append(timestamp).append(msgContent);
    searchResult.append(msg);
  })
  $('#chat-bot').append(searchResult);
}

// function to build the list of videos with corresponding thumb nails and titles
function buildVideo(v) {
  var outline = $('<div>').addClass('outline col-sm-6 col-md-6');
  var video = $('<div>').addClass('video');
  var thumbnail = $('<img>').addClass('video-thumb').attr('src', v.snippet.thumbnails.medium.url);
  var text = trimText(v.snippet.title);
  var title = $('<span>').addClass('video-title').text(text);
  video.on('click', function() {
    clickVideo(v);
  })
  video.append(thumbnail).append(title);
  outline.append(video);
  $('#all-videos').append(outline);
}

// function to retrieve the live chat based on liveChatId
function getLiveChat(videoId) {
    var requestId = gapi.client.youtube.videos.list({
      id: videoId,
      part: "liveStreamingDetails",
    });

    requestId.execute(function(response) {
      if(response.items&&response.items.length>0) {
        var video = response.items[0];
        if(video.liveStreamingDetails.activeLiveChatId) {
        var requestChat = gapi.client.youtube.liveChatMessages.list({
          liveChatId: video.liveStreamingDetails.activeLiveChatId,
          part: "snippet",
          pageToken: chatData[0] ? chatData[0].nextPageToken : ""
        });
        requestChat.execute(function(response) {
          if(response.items&&response.items.length>0) {
            response.items.forEach(function(item, i) {
              chatData.unshift(item.snippet);
              chatData[0].nextPageToken = response.nextPageToken;
              chatData[0].pollingIntervalMillis = response.pollingIntervalMillis;
            });
          }
          response.items.forEach(function(item, i) {
            var requestChannelName = gapi.client.youtube.channels.list({
              id: item.snippet.authorChannelId,
              part: "snippet"
            });
            requestChannelName.execute(function(res) {
              chatData[i].channelName = res.items[0].snippet.title;
            });
          });

        });
      }
    }
  });
}

// function to populate the obtained live chat comments on the web page
function buildChat(chat) {
  if($('.chat-outline').length>0) {
    $('.chat-outline').remove();
  }
  var chatOutline = $('<div>').addClass('chat-outline col-sm-7 col-md-7');
  var chatContainer = $('<div>').addClass('insert-chat');
  var chatHeader = $('<div>').addClass('chat-header');
  var headerTitle = $('<h2>').addClass('chat-title').text('Live Chat');
  var msgContainer = $('<div>').addClass('chat-messages');
  msgContainer.empty();
  chatContainer.append(chatHeader);
  chatContainer.append(msgContainer);
  chatHeader.append(headerTitle);

  chat.forEach(msg => {
    var message = $('<div>').addClass('chat-msg col-sm-12 col-md-12');
    var channel = $('<div>').addClass('chat-channel-name col-sm-3 col-md-3');
    channel.text(msg.channelName + ':');
    var timestamp = $('<div>').addClass('chat-msg-timestamp col-sm-1 col-md-1');
    timestamp.text(getTimeFormat(msg.publishedAt));
    var msgContent = $('<div>').addClass('chat-msg-content col-sm-8 col-md-8');
    msgContent.text(msg.displayMessage);
    message.append(channel);
    message.append(msgContent).append(timestamp);
    msgContainer.prepend(message);
  });
  chatOutline.append(chatContainer);
  $('#live-video').append(chatOutline);

}

// function to return time in hh:mm:ss format
function getTimeFormat(d){
  var date = new Date(d);
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  if (min < 10) {
    min = "0" + min;
  };
  const dateText = hour + ':' + min + ':' + sec;
  return dateText;
}

// function to shorten the video title which are greater than 30 characters in length
function trimText(t) {
  var res = t;
  if(t.length>30) {
    res = t.substr(0,30)+'....';
  }
  return res;
}

// function to sort the date publishedAt
function compare(a, b) {
 const date1 = a.publishedAt;
 const date2 = b.publishedAt;
 let comparison = 0;
 if (date1 > date2) {
   comparison = 1;
 } else if (date1 < date2) {
   comparison = -1;
 }
 return comparison;
}

// function to obtain the frequency of chat at 10sec interval
function getStats(data) {
  var res = [];
  data.sort(compare);
  var startInterval = "";
  if(data.length > 0){
    startInterval = new Date(data[0].publishedAt);
  }

  data.forEach(function(item){
    let date = new Date(item.publishedAt);
    if(date-startInterval < 10000){
      if(res.length > 0){
        res[res.length-1] = res[res.length-1] + 1;
      }else{
        res[0] = 1;
      }
    }else{
      startInterval = date;
      res.push(1);
    }
  });
  return res;
}
