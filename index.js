const isSubset = require("is-subset");
const imdb_rotten = require("./src/index");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Api work correctly !!!");
});

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const search = await imdb_rotten.searchMovie(query);
  res.send(search);
});

app.get("/movie/:type/:movie", async (req, res) => {
  const movie = await imdb_rotten.selectMovie(
    req.params.type,
    req.params.movie
  );
  res.send(movie);
});

app.get("/compare", async (req, res) => {
  ObjectA = {
    title: "Alita: Battle Angel",
    year: "2019",
    casts: [
      "Rosa Salazar",
      "Christoph Waltz",
      "Jennifer Connelly",
      "Mahershala Ali",
      "Michelle Rodriguez",
      "Casper Van Dien"
    ]
  };

  ObjectB = {
    title: "Alita: Battle Angel",
    casts: ["Rosa Salazar", "Christoph Waltz"],
    year: "2019"
  };

  console.log(isSubset(ObjectA, ObjectB));
});

app.get("/:imdbId", async (req, res) => {
  const movie = await imdb_rotten.selectImdbMovie(req.params.imdbId);
  res.send(movie);
});

app.listen("3000", () => {
  console.log("Server is running ...");
});
