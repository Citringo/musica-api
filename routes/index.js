var express = require('express');
var config = require("../config");
var mysql = require("promise-mysql");
var LINQ = require("node-linq").LINQ;

var router = express.Router();

var defaultObj = {ok: true, music_url: "https://files.citringo.net/music/"};

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

const idPattern = /^(XEL|ARG)_(\d{3})([A-Z])?(?:v(\d))?$/;

const check = (s, k) => s.display_id.toLowerCase().includes(k)  ||
                        s.title.toLowerCase().includes(k)       ||
                        s.description.toLowerCase().includes(k) ||
                        s.client.toLowerCase().includes(k)      ||
                        s.source.toLowerCase().includes(k)      ||
                        s.music_type.toLowerCase().includes(k);

router.get("/list/", async (req, res, next) => {
  var o = defaultObj;
  o.music = await getList();
  
  if (o.music.length == 0) {
    o = { ok: false, error: "Requested items are not found" };
    res.status(404);
  }
  res.json(o);
});

router.get("/search", async (req, res, next) => {
  var o = defaultObj;
  if (!req.query.keyword) {
    o.ok = false;
    res.status(404);
    o.error = "please set 'keyword' query";
  }
  else {
    o.ok = true;
    var keys = req.query.keyword.split(/\s/);
    o.music = new LINQ(await getList())
            .Where(v => keys.every(k => check(v, k.toLowerCase())))
            .ToArray();
    if (o.music.length == 0) {
      o = { ok: false, error: "Requested items are not found" };
      res.status(404);
    }
  }
  res.json(o);
});

router.get("/relative/:id", async(req, res, next) => {
  var o = defaultObj;
  if (!idPattern.test(req.params.id)) {
    res.json({ ok: false, error: "invalid id pattern"});
    return;
  }
  var id = idPattern.exec(req.params.id);
  var connection = await mysql.createConnection(sql_config);
  o.music = await connection.query("SELECT songs.display_id, songs.title, songs.description, clients.name as client, songs.source, music_types.name as music_type, songs.is_completed " +
  "from songs, clients, music_types " +
  "where clients.id = songs.client_id and music_types.id = songs.music_type_id and songs.number = ? and songs.display_id like ? and songs.display_id <> ?;", [Number(id[2]), `${id[1]}%`, req.params.id]);
  
  if (o.music.length == 0) {
    o = { ok: false, error: "Requested items are not found" };
    res.status(404);
  }
  res.json(o);
});

router.get("/:id", async(req, res, next) => {
  var o = defaultObj;

  if (!idPattern.test(req.params.id)) {
    res.json({ ok: false, error: "invalid id pattern"});
    return;
  }

  var connection = await mysql.createConnection(sql_config);
  var music = await connection.query("SELECT songs.display_id, songs.title, songs.description, clients.name as client, songs.source, music_types.name as music_type, songs.is_completed " +
  "from songs, clients, music_types " +
  "where clients.id = songs.client_id and music_types.id = songs.music_type_id and songs.display_id = ?;", [req.params.id]);
  
  if (music.length == 0) {
    o = { ok: false, error: "Requested items are not found" };
    res.status(404);
    res.json(o);
    return;
  }
  o.music = music[0];
  res.json(o);
});

router.use((req, res) => {
  res.status(404);
  res.json({ok: false, error: "Not Found"});
})


module.exports = router;