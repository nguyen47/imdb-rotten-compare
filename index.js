const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const _ = require("lodash");

const searchMovie = async query => {
  const rottenUrl = `https://www.rottentomatoes.com/napi/search/?limit=5&query=${query}`;
  const rottenResponse = await fetch(rottenUrl);
  const rottenResult = await rottenResponse.json();
  const rottenPickData = _.pick(rottenResult, ["movies", "tvSeries"]);
  console.log(rottenPickData);

  const imdbUrl = `https://sg.media-imdb.com/suggests/${query.charAt(
    0
  )}/${query}.json`;
  const imdbResponse = await fetch(imdbUrl);
  const imdbResult = await imdbResponse.text();
  const imdbPickData = JSON.parse(
    imdbResult.slice(0, -1).replace(`imdb$${query}(`, "")
  );

  console.log(imdbPickData);

  const searchedMovie = {
    rottenPickData,
    imdbPickData
  };
  // console.log(searchedMovie);
};

// const selectMovie = async movieTitle => {
//   const url = `https://www.rottentomatoes.com/m/${movieTitle}`;
//   const response = await fetch(url);
//   const result = await response.text();
//   const $ = cheerio.load(result);
//   const title = $("h1.mop-ratings-wrap__title")
//     .text()
//     .trim();
//   const tomatometerScore = $("#tomato_meter_link > span:nth-child(2)")
//     .text()
//     .trim();
//   const reviewCounted = $(
//     "div.mop-ratings-wrap__half:nth-child(1) > div:nth-child(2) > small:nth-child(3)"
//   )
//     .text()
//     .trim();
//   const audienceScore = $(
//     "div.mop-ratings-wrap__half:nth-child(2) > h1:nth-child(1) > a:nth-child(1) > span:nth-child(2)"
//   )
//     .text()
//     .trim()
//     .replace(/ /g, "")
//     .replace(/\r?\n|\r/g, "")
//     .replace("likedit", "");

//   const usersRating = $(
//     "div.mop-ratings-wrap__half:nth-child(2) > div:nth-child(2) > small:nth-child(3)"
//   )
//     .text()
//     .trim();

//   const rottentomatoes = {
//     title,
//     tomatometerScore,
//     reviewCounted,
//     audienceScore,
//     usersRating
//   };

//   // const resp = await fetch(`https://sg.media-imdb.com/suggests/a/avenger.json`);
//   // const result = await resp.text();
//   // console.log(JSON.parse(result.slice(0, -1).replace(`imdb$avenger(`, "")));

//   const movie = {
//     rottentomatoes
//   };

//   console.log(movie);
//   return movie;
// };

searchMovie("avenger");
// selectMovie("the_dark_knight");
