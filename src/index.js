const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const _ = require("lodash");

const searchMovie = async query => {
  const rottenUrl = `https://www.rottentomatoes.com/napi/search/?query=${query}`;
  const rottenResponse = await fetch(rottenUrl);
  const rottenResult = await rottenResponse.json();
  const rottenPickData = _.pick(rottenResult, ["movies", "tvSeries"]);
  return rottenPickData;
};

const selectMovie = async (type, movieTitle) => {
  const url = `https://www.rottentomatoes.com/${type}/${movieTitle}`;
  const response = await fetch(url);
  const result = await response.text();
  const $ = cheerio.load(result);
  const title = $("h1.mop-ratings-wrap__title")
    .text()
    .trim();
  const tomatometerScore = $("#tomato_meter_link > span:nth-child(2)")
    .text()
    .trim();
  const reviewCounted = $(
    "div.mop-ratings-wrap__half:nth-child(1) > div:nth-child(2) > small:nth-child(3)"
  )
    .text()
    .trim();
  const audienceScore = $(
    "div.mop-ratings-wrap__half:nth-child(2) > h1:nth-child(1) > a:nth-child(1) > span:nth-child(2)"
  )
    .text()
    .trim()
    .replace(/ /g, "")
    .replace(/\r?\n|\r/g, "")
    .replace("likedit", "");

  const usersRating = $(
    "div.mop-ratings-wrap__half:nth-child(2) > div:nth-child(2) > small:nth-child(3)"
  )
    .text()
    .trim();

  const director = $(
    "li.meta-row:nth-child(3) > div:nth-child(2) > a:nth-child(1)"
  )
    .text()
    .trim();
  const year = $(
    "li.meta-row:nth-child(5) > div:nth-child(2) > time:nth-child(1)"
  )
    .text()
    .trim()
    .slice(-4);

  const casts = [];

  $(".castSection .cast-item").each((i, item) => {
    const $item = $(item);
    const name = $item
      .find(".unstyled > span")
      .text()
      .trim();
    casts.push(name);
  });

  const rottenMovie = {
    title,
    year,
    casts
  };

  const imdbMovie = await imdbSearch(`${movieTitle}`);

  compareMovie(rottenMovie, imdbMovie);
  // const rottentomatoes = {
  //   title,
  //   director,
  //   year,
  //   casts,
  //   tomatometerScore,
  //   reviewCounted,
  //   audienceScore,
  //   usersRating
  // };
  return rottenMovie;
};

const imdbSearch = async query => {
  const imdbUrl = `https://sg.media-imdb.com/suggests/${query.charAt(
    0
  )}/${query}.json`; // query.split(" ").join("_")
  const imdbResponse = await fetch(imdbUrl);
  const imdbResult = await imdbResponse.text();
  const imdbPickData = JSON.parse(
    imdbResult.slice(0, -1).replace(`imdb$${query}(`, "")
  );
  // Change Key Name of the Array
  const movieImdbChangeKeyName = [];
  for (let index = 0; index < imdbPickData.d.length; index++) {
    const movie = {
      id: imdbPickData.d[index].id,
      title: imdbPickData.d[index].l,
      casts: imdbPickData.d[index].s,
      year: imdbPickData.d[index].y
    };
    movieImdbChangeKeyName.push(movie);
  }
  // Remove the object with has contain at least one undefined
  _.remove(movieImdbChangeKeyName, n => {
    return (
      n.title === undefined || n.casts === undefined || n.year === undefined
    );
  });

  // Convert string casts to array
  const imdbMovie = [];
  for (let index = 0; index < movieImdbChangeKeyName.length; index++) {
    const movie = {
      id: movieImdbChangeKeyName[index].id,
      title: movieImdbChangeKeyName[index].title,
      casts: movieImdbChangeKeyName[index].casts.replace(/\s/g, "").split(","),
      year: movieImdbChangeKeyName[index].year.toString()
    };
    imdbMovie.push(movie);
  }

  return imdbMovie;
};

const compareMovie = (rottenMovie, imdbMovie) => {
  console.log(rottenMovie, imdbMovie);
};

module.exports.searchMovie = searchMovie;
module.exports.selectMovie = selectMovie;
module.exports.imdbSearch = imdbSearch;
