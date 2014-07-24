var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var noble = require('noble');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get("/api/getData", function (req, res) {
  console.log("here");
  res.send(200, "OK");
});



/******************************************************************************/
var devices = [];

var getDevices = function() {
  console.log('getDevices');

  noble.on('scanStart', function() {
    console.log("Starting to scanning peripheral");
  });

  noble.on('discover', function(peripheral) {
    console.log('Found device with local name: ' + peripheral.advertisement.localName);
    console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
    console.log();
    devices.push(peripheral.advertisement.serviceUuids);
  });

  noble.startScanning(); // any service UUID, allow duplicate
}

getDevices();

/******************************************************************************/
 

app.post("/api/postData", function (req, res) {
  console.log("here");
  // noble.on('stateChange', function(state) {
  // // possible state values: "unknown", "resetting", "unsupported", "unauthorized", "poweredOff", "poweredOn"
  //   if (state === 'poweredOn') {
  //     noble.startScanning();
  //     console.log("Scanning...");
  //   } else {
  //     noble.stopScanning();
  //   }
  // ...
  // });

  res.send(200, "here are devices : " + devices.join(","));
});

/// error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
