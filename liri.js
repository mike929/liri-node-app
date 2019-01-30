"use strict";

require("dotenv").config();
// require('dotenv').config({'/.env'});

//----------------NPM-----------------//
const env = require("dotenv").config();
const keys = require('./assets/javascript/keys.js');
const request = require("request");
const fs = require("fs-plus");
const moment = require('moment');


var cTable = require('console.table');



//----------API SPECIFIC NPM----------//
var Spotify = require("node-spotify-api");


//--------------API KEYS--------------//
var spotify = new Spotify(keys.spotify);


//------------LIRI COMMANDS------------//
var nodeArgs = process.argv;
var inputCmd = process.argv[2];
var inputQuery;
var inputTemp;

//concatenating longer inputs to make this work
if (nodeArgs.length >= 4) {
    for (let i = 3; i < nodeArgs.length; i++) {
        inputTemp = inputTemp + " " + nodeArgs[i];
    }
    var inputQuery = inputTemp.replace('undefined ', '');
} else {
    inputQuery = process.argv[3];
}



//---------API QUERY VARIABLES---------//

var params = "";
var outputNum = 1;

//--------------FORMATTING--------------//

var border = "\n=======================================================\n";
var hr = "\n-------------------------------------------------------\n";
var br = "\n";



//---------------GET READY--------------//
if (inputQuery && inputCmd) {
    console.log(border + "\tYou Requested: " + inputQuery + border);
} else if (inputCmd != "do-what-it-says") {
    console.log(border + "\tYou Requested: Liri's Choice " + border);
}

//---------------FUNCTIONS--------------//

//----------------Bands In Town---------------//

// if (process.argv[2] == 'concert-this' ) {
function concertThis() {
    if (process.argv[2] == 'concert-this') {
        var artist = process.argv.slice(3).join(" ")
        console.log(artist);
    };

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (err, res, body) {
        if (err) console.log(err);
        var result = JSON.parse(body)[0];
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " + moment(result.datetime).format("MM/DD/YYYY"));



    });
};

//----------------SPOTIFY---------------//
//`spotify-this-song`
// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
//***********
// If no song is provided then your program will default to "The Sign" by Ace of Base.

function spotifyThisSong() {
    var query = "";

    if (inputQuery === undefined) {
        query = "The Sign ace";
    } else {
        query = inputQuery;
    }

    spotify.search({
        type: 'track',
        query: query,
        limit: 1
    }, function (err, data) {
        if (err) {
            throw err;
        }

        var artistName = data.tracks.items[0].album.artists[0].name;
        var albumName = data.tracks.items[0].album.name;
        var songName = data.tracks.items[0].name;
        var previewUrl = data.tracks.items[0].external_urls.spotify;

        console.log(border +
            "Artist's name: " + artistName + br +
            "Album name: " + albumName + br +
            "Song name: " + songName + br +
            "Song URL: " + previewUrl +
            border);
    });
};



//----------------OMDb-----------------//
//`movie-this`
// this will output the following information to your terminal/bash window:
// Title of the movie.
// Year the movie came out.
// IMDB Rating of the movie.
// Rotten Tomatoes Rating of the movie.
// Country where the movie was produced.
// Language of the movie.
// Plot of the movie.
// Actors in the movie.
//***********
//If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

function movieThis() {
    var movieQuery;

    if (inputQuery === undefined) {
        movieQuery = "Mr Nobody";
        var queryURL = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
          console.log("For testing: " + queryURL + " (MR NOBODY)");

    } else {
        movieQuery = inputQuery;
    }
    // console.log("The movie you requested: " + movieQuery);
    var queryURL = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

    request(queryURL, (err, res, body) => {
        if (err) throw err;
        if (!err && res.statusCode === 200) {

            var title = JSON.parse(body).Title;
            var releaseDate = JSON.parse(body).Released;
            var country = JSON.parse(body).Country;
            var language = JSON.parse(body).Language;
            var plot = JSON.parse(body).Plot;
            var actors = JSON.parse(body).Actors;

            //check for ratings
            var rateIMDB;
            var rateRT;

            if (JSON.parse(body).Ratings[0]) {
                rateIMDB = JSON.parse(body).imdbRating;
            } else {
                rateIMDB = "Unrated";
            }

            if (JSON.parse(body).Ratings[1]) {
                rateRT = JSON.parse(body).Ratings[1].Value;
            } else {
                rateRT = "Unrated";
            }

            console.log(border + "Title: " + title + hr +
                "Released: " + releaseDate + br +
                "Rating: " + rateIMDB + br +
                "Rotten Tomatoes Rating: " + rateRT + br +
                "Country: " + country + br +
                "Language: " + language + hr +
                "Plot: " + plot + hr +
                "Actors: " + actors + border);
        }
    });
};

//---------------DO WHAT IT SAYS--------------//
//`do-what-it-says`
// Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
// Feel free to change the text in that document to test out the feature for other commands

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, res) {
        if (err) throw err;
        let data = res.split(",");
           console.log(data);
        // console.table(data);
        inputQuery = data[1].trim();
        let inputType = data[0];


        // inputQuery = inputRequest;

        console.log(border + "\tYou Requested: " + inputQuery + border);

        switch (inputType) {
            //Spotify API
            case 'spotify-this-song':
                spotifyThisSong();
                break;

                //OMDB API
            case 'movie-this':
                movieThis();
                break;

                //Bands API
            case 'concert-this':
                concertThis();
                break;

            case 'do-what-it-says':
                doWhatItSays();
                break;

        }
    })
};




//----------------HERES A LOG-----------------//
// log.txt
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// Make sure you append each command you run to the `log.txt` file. 
// Do not overwrite your file each time you run a command.
//check bank exercise


//-----------------DO THE THING----------------//

switch (inputCmd) {
    //Spotify API
    case 'spotify-this-song':
        spotifyThisSong();
        break;

        //OMDB API
    case 'movie-this':
        movieThis();
        break;

        //Bands API
    case 'concert-this':
        concertThis();
        break;

        //DO WHAT IT SAYS
    case 'do-what-it-says':
        doWhatItSays();
        break;

    default:
        console.log(border +
            "If you want me to do something, you have to tell me" +
            border +
            "\tHere's a hint: " +
            hr + br +
            "Lookup a song, type 'node liri.js spotify-this-song  [song name]" + br +
            "lookup a movie, type 'node liri.js movie-this [movie name]'" + br +
            "Read from the .txt prompt, type 'do-what-it-says'" + br + hr +
            "So what would you like me to do?" + border);
}