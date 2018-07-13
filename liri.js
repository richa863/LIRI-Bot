require("dotenv").config();
var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var accountTweets = new Twitter(keys.twitter);
var tweetLimit = 20;
var spotify = new Spotify(keys.spotify);
var defaultSong = "The Sign";
var defaultMovie = "Mr. Nobody";
var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    mySpotify();
    break;
  case "movie-this":
    movieSearch();
    break;
  case "do-what-it-says":
    randomTXT();
    break;
  default: 
  console.log("Hey there, try one of these:");
  console.log("my-tweets, spotify-this-song, movie-this, do-what-it-says");
    break;
}



function myTweets() {
 
var params = {screen_name: 'BrianRi81527595', count: tweetLimit};
accountTweets.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (error) {
    console.log(error);
  } else if (!error) {
    console.log("\nThese are your last " + (tweets.length) + " tweets: \n");
      for (var i = 0; i < tweets.length; i++) {
        console.log("Tweets " + (i+1) + ": " + "\n" + tweets[i].text + 
          "\n" + "Created on: " + tweets[i].created_at);
        console.log("--------------------");
      }
  }
  });
}; 



function mySpotify() {

  spotify.search({ type: 'track', query: value, limit: '1'}, function(err, data) {
    if (err) {
      console.log('Error occured: ' + err);
    } else {

      console.log("\nArtist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2) + "\n");
      console.log("Song Title: " + JSON.stringify(data.tracks.items[0].name) + "\n");
      console.log("Link: " + JSON.stringify(data.tracks.items[0].album.external_urls) + "\n");
      console.log("Album " + JSON.stringify(data.tracks.items[0].album.name));
      
    }
  });
};



function movieSearch() {


var args = process.argv;


var movieName = "";


for (var i = 3; i < args.length; i++) {

if (i > 3 && i < args.length) {
  movieName = movieName + "+" + args[i];
} else {
  movieName += args[i];
 }
}


var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&tomatoes=true&y=&plot=short&r=json";

request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var body = JSON.parse(body);

      console.log("\nMovie Title: " + body.Title + "\n ");
      console.log("Year Released: " + body.Released + "\n ");
      console.log("Rating: " + body.Rated + "\n ");
      console.log("Production Country: " + body.Country + "\n ");
      console.log("Language: " + body.Language + "\n ");
      console.log("Plot: " + body.Plot + "\n ");
      console.log("Cast: " + body.Actors + "\n ");
      console.log("Rotten Tomatoes Rating: " + body.Ratings[1].value + "\n ");
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);
  } else {
    console.log(error);
  };
});
}



function randomTXT() {

  fs.readFile('./random.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    else {
      console.log(data);

      var arr = data.split(",");
      value = arr[1];
        if(arr[0] == "movie-this") {
          movieSearch(value);
        }
        else if (arr[0] == "spotify-this-song") {
          mySpotify(value);
        }
        else if (arr[0] == "my-tweets") {
          myTweets();
        }
    }
  });  
};
