var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/v1", index);

app.use(function(req, res, next) {
	var mes = 404 + " Cannot " + req.method + " " + req.path;
	var error = new Error(mes);
	error.message = mes;
	next(error);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.json({ok: false, error: err.message});
});



module.exports = app;
