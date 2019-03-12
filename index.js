const imdb_rotten = require("./src/index");
(async () => {
  const selectMovie = await imdb_rotten.selectMovie("m", "alita_battle_angel");
})();
