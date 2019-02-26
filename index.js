const express = require("express");
const fetch = require("node-fetch");
const _ = require("lodash");

const searchMovie = async query => {
  const url = `https://www.rottentomatoes.com/napi/search/?limit=5&query=${query}`;
  const response = await fetch(url);
  const result = await response.json();
  const formattedResult = _.pick(result, ["movies", "tvSeries"]);
  console.log(formattedResult);
  return formattedResult;
};

const selectMovie = async movieTitle => {
  const url = `https://www.rottentomatoes.com/m/${movieTitle}`;
  const response = await fetch(url);
  const result = await response.text();
  console.log(result);
};

selectMovie("marvels_the_avengers");
