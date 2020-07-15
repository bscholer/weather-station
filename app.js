var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dayjs = require('dayjs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "127.0.0.1"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// API

// Current observations, https://docs.google.com/document/d/1KGb8bTVYRsNgljnNH67AMhckY8AQT2FVwZ9urj8SWBs/edit
app.get("/current-observations", (request, response, next) => {
    response.json({
            observations: [
                {
                    stationID: "KNCCARY89",
                    obsTimeUtc: dayjs().format(),
                    obsTimeLocal: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    neighborhood: "Highcroft Village",
                    softwareType: "GoWunder 1337.9041ac1",
                    country: "US",
                    solarRadiation: 436.0,
                    lon: -78.8759613,
                    realtimeFrequency: null,
                    epoch: 1549291994,
                    lat: 35.80221176,
                    // uv: 1.2,
                    winddir: 329,
                    humidity: 40,
                    qcStatus: 1,
                    imperial: {
                        temp: 90,
                        heatIndex: 110,
                        dewpt: 54,
                        windChill: 53,
                        windSpeed: 2,
                        windGust: null,
                        pressure: 30.09,
                        precipRate: 0.0,
                        precipTotal: 0.0,
                        elev: 413
                    }
                }
            ]
        }
    );
});



// Set Station Location
app.post("/set-station-location", (request, response) => {

    if ((request.body.lat && request.body.lng) || request.body.elev) {
        // Store this in the StationLocation table
        console.log("Latitude: " + request.body.lat + "\nLongitude: " + request.body.lng + "\nElevation: " + request.body.elev);

        // 200 OK
        response.sendStatus(200);
    } else {
        // 400 Malformed Query
        response.sendStatus(400)
    }

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
