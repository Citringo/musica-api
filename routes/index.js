var express = require('express');
var config = require("../config");
var mysql = require("promise-mysql");
var LINQ = require("node-linq").LINQ;


var router = express.Router();

var sql_config = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
};

var getList = async () => {
  var connection = await mysql.createConnection(sql_config);

  var list = connection.query(
    "SELECT songs.display_id, songs.title, songs.description, clients.name as client, songs.source, music_types.name as music_type, songs.is_completed " +
    "from songs, clients, music_types " +
    "where clients.id = songs.client_id and music_types.id = songs.music_type_id;"
  );

  await connection.end();
  return list;
};

// display_id: "ARG_001",
// title: "海岸線ワールドトリップ",
// description: "メルビル氏に依頼され制作した曲．",
// client: "Melville ",
// source: "",
// music_type: "編曲",
// is_completed: 0

const check = (s, k) => s.display_id.toLowerCase().includes(k)  ||
                        s.title.toLowerCase().includes(k)       ||
                        s.description.toLowerCase().includes(k) ||
                        s.client.toLowerCase().includes(k)      ||
                        s.source.toLowerCase().includes(k)      ||
                        s.music_type.toLowerCase().includes(k);

router.get("/list/", async (req, res, next) => {
  var o = {ok: true,　path: "https://files.citringo.net/music/"};
  o.music = await getList();
  res.json(o);
});

router.get("/search", async (req, res, next) => {
  var o = {};
  if (!req.query.keyword) {
    o.ok = false;
    o.error = "please set 'keyword' query";
  }
  else {
    o.ok = true;
    var keys = req.query.keyword.split(/\s/);
    o.music = new LINQ(await getList())
            .Where(v => keys.every(k => check(v, k.toLowerCase())))
            .ToArray();
  }
  res.json(o);
});

router.use((req, res) => {
  res.status(404);
  res.json({ok: false, error: "Not Found"});
})


module.exports = router;