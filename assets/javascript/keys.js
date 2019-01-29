"use strict";

console.log('this is loaded');


// Read and set environment variables
require("dotenv").config();


exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
  apiKey: process.env.OMDB_APIKEY
};

exports.bandsInTown = {
  apiKey: process.env.BANDSINTOWN_APIKEY
};