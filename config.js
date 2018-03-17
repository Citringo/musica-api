const path = require("path");
const fs = require("fs");

const file = path.join(__dirname, "config.json");
var config;

if (!fs.existsSync(file)){
	fs.writeFileSync(file, JSON.stringify({
		"db": {
			host: "dbms hostname",
			user: "dbms user's name",
			password: "dbms user's password",
			database: "db name to use",
		}
	}, null, 4), "utf-8");
	console.error("Please set config");
	process.exit(1);
}

module.exports = JSON.parse(fs.readFileSync(file, "utf-8"));