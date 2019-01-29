"use strict";
/* jshint node: true */

let Spotify = require('node-spotify-api');
let axios = require('axios');
let moment = require('moment');
var fs = require("fs");

let keys = require("./keys.js");

let spotify = new Spotify(keys.spotify);

// Spotify Search
function spotifySearch(songName) {
    let searchForSong = "Indiscipline";

    if (songName != undefined) {
        searchForSong = songName;
    }
    // SPOTIFY
    spotify.search({
        type: 'track',
        query: searchForSong
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // let displayData = JSON.stringify(data, null, 2);
        //console.log(displayData);

        logAppend(`\n----------------- Search Spotify ----------------------------`);
        logAppend(`\nSong: ${searchForSong}`);

        for (let i in data.tracks.items) {
            logAppend("\nSong Information");
            logAppend("----------------");
            logAppend(`Artist: ${data.tracks.items[i].artists[0].name}`);
            logAppend(`Song Preview: ${data.tracks.items[i].external_urls.spotify}`);
            logAppend(`Album: ${data.tracks.items[i].album.name}`);
        }
    });
}

// OMDB Search
// We then run the request with axios module on a URL with a JSON
function searchOMDB(movieName) {
    let searchForMovie = "Mr. Nobody";

    if (movieName != undefined) {
        searchForMovie = movieName;
    }

    axios.get(`http://www.omdbapi.com/?t=${searchForMovie}&y=&plot=short&apikey=${keys.omdb.apiKey}`)
        .then(
            function (response) {
                //console.log(JSON.stringify(response.data, null, 2));

                logAppend(`\n----------------- Search OMDB ----------------------------`);
                logAppend(`Title: ${response.data.Title}`);
                logAppend(`Year: ${response.data.Year}`);
                logAppend(`Ratings`);

                for (let i in response.data.Ratings) {
                    logAppend(`${response.data.Ratings[i].Source}: ${response.data.Ratings[i].Value}`);
                }
                logAppend(`Country: ${response.data.Country}`);
                logAppend(`Language: ${response.data.Language}`);
                logAppend(`Plot: ${response.data.Plot}`);
                logAppend(`Actors: ${response.data.Actors}`);
            }
        )
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
            }
        });
}

// Band Search
function searchBand(bandName) {
    let searchForBand = "Bluedot";

    if (bandName != undefined) {
        searchForBand = bandName;
    }
    let requestURL = `https://rest.bandsintown.com/artists/${searchForBand}/events?app_id=${keys.bandsInTown.apiKey}`;

    axios.get(requestURL)
        .then(
            function (response) {
                logAppend(`\n-------------------- Search Bands in Town -------------------------`);
                logAppend(`${searchForBand} Upcoming concerts`);

                // print each upcoming evennt
                for (let i in response.data) {
                    let displayDate = moment(response.data[i].datetime).format("MM/DD/YYYY");

                    logAppend(`\nLOCATIONS`);
                    logAppend(`Name: ${response.data[i].venue.name}`);
                    logAppend(`Location: ${response.data[i].venue.city}`);
                    logAppend(`Date: ${displayDate}`);
                }
            }
        )
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
            }
        });
}

// Get task to do from the file random.txt
function taskFromFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        let dataArr = data.split(",");
        // console.log(dataArr);

        let command = dataArr[0];
        let parameter = dataArr[1];

        runCommand(command, parameter);
    });
}

function logAppend(dataToLog) {
    console.log(dataToLog);
    fs.appendFile("log.txt", `${dataToLog}\n`, function (err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }

    });
}

// Help for command line
function moduleHelp() {
    console.log(`Available Commands on ${moment().format("YYYY/MM/DD")}`);
    console.log(`node liri.js ?`);
    console.log(`node liri.js concert-this <artist/band name here>`);
    console.log(`node liri.js spotify-this-song '<song name here>'`);
    console.log(`node liri.js movie-this '<movie name here>'`);
    console.log(`node liri.js do-what-it-says`);
}

// run function based on command entered
function runCommand(command, parameter) {
    // Run function based on command passed
    switch (command) {
        case `spotify-this-song`:
            spotifySearch(parameter);
            break;

        case `movie-this`:
            searchOMDB(parameter);
            break;

        case `concert-this`:
            searchBand(parameter);
            break;

        case `do-what-it-says`:
            taskFromFile(parameter);
            break;

        case `?` || `help`:
            moduleHelp();
            break;

        default:
            moduleHelp();
            break;
    }
}

// MAIN Program Start
let command = process.argv[2];
let parameter = process.argv[3];

runCommand(command, parameter);