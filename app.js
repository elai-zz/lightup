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
var peripheralUuid = "9059af170332";
var lightupPeripheral;

console.log("before stateChange");

noble.on('stateChange', function(state) {
  console.log("state " + state);
  if (state === 'poweredOn') {
    noble.startScanning();
    console.log("Scanning...");
  } else {
  console.log("Bluetooth isn't on!");
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  if (peripheral.uuid === peripheralUuid) {
    console.log("found light bulb!");
      noble.stopScanning();
      console.log('matching services and characteristics...');
    lightupPeripheral = peripheral;
    }
});
/******************************************************************************/
 

app.post("/api/postData", function (req, res) {
  console.log("here");

  if (lightupPeripheral) {
      lightupPeripheral.connect(function(error) {
      // main service for serial
      var serviceUUIDs = ["ffe0"];
      var characteristicUUIDs = ["ffe1"];
      peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs,function(err,services,chars)  {
      console.log(req.body);
      console.log(req.params);
      var buf = new Buffer("0,255,0\n", "ascii");
   
      console.log(buf);
      chars[0].write(buf, false);
      });
    });
    res.send(200, "here are devices : " + devices.join(","));
  } else {
    res.send(500, "Lightup not found.");
  }
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
