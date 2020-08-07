$(function () {
    refreshData();
});

function refreshData() {
    $.ajax({
        headers: {"Accept": "application/json"},
        type: 'GET',
        url: 'http://192.168.0.197:3000/current-observations',
        crossDomain: true,
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
        },
        success: function (data, textStatus, request) {
            console.log(data);
            let observations = data.observations[0];
            let imperial = observations.imperial;
            let temp = imperial.temp;
            let humidity = observations.humidity;
            let atmosphericPressure = imperial.pressure;
            let windSpeed = imperial.windSpeed;
            let windDir = getCardinal(observations.winddir);
            let windSpeedDir = windSpeed + " " + windDir;
            let dewPoint = imperial.dewpt;
            let heatIndex = imperial.heatIndex;
            let windChill = imperial.windChill;
            let precipTotal = imperial.precipTotal;

            // If we can't use heat index or wind chill for the feels like, just use the current temperature.
            let feelsLikeTemp = temp;
            // Check if we can use the heat index as the feels like temp.
            if (temp >= 80 && dewPoint >= 54 && humidity >= 40) {
                feelsLikeTemp = heatIndex;
            }
            // We can't use heat index for the feels like temp, so check if we can use the wind chill for it.
            else if (temp <= 40 && windSpeed >= 3) {
                feelsLikeTemp = windChill;
            }

            // Set the values in the DOM
            $("#current_temp").text(temp.toFixed(1) + " °F");
            $("#current_humidity").text(humidity + "%");
            $("#current_atmospheric_pressure").text(atmosphericPressure + " inHg");
            $("#current_wind_speed_dir").text(windSpeed + " mph " + windDir);
            $("#current_feels_like").text(feelsLikeTemp + " °F");
            $("#current_precipitation").text(precipTotal + " in");

            setFAClassFromTemp($("#current_temp_icon"), temp);
            setFAClassFromTemp($("#current_feels_like_icon"), feelsLikeTemp);
        },
        error: function (err) {
            console.log("Couldn't query API.");
            console.log(err);
        }
    });
}

// Set the appropriate font awesome thermometer class for the given temperature.
function setFAClassFromTemp(jQueryObj, temp) {
    let scale = [30, 50, 70, 100];
    let className = "";
    if (temp <= scale[0]) {
        className = "fa-thermometer-empty"
    } else if (temp > scale[0] && temp <= scale[1]) {
        className = "fa-thermometer-quarter"
    } else if (temp > scale[1] && temp <= scale[2]) {
        className = "fa-thermometer-half"
    } else if (temp > scale[2] && temp <= scale[3]) {
        className = "fa-thermometer-three-quarters"
    } else {
        className = "fa-thermometer-full"
    }

    // Remove the old thermometer class
    jQueryObj.removeClass (function (index, className) {
        return (className.match (/(^|\s)fa-thermometer-+/g) || []).join(' ');
    });

    // Add the new class
    jQueryObj.addClass(className);
}

// Source: https://gist.github.com/basarat/4670200
function getCardinal(angle) {
    /**
     * Customize by changing the number of directions you have
     * We have 8
     */
    const degreePerDirection = 360 / 8;

    /**
     * Offset the angle by half of the degrees per direction
     * Example: in 4 direction system North (320-45) becomes (0-90)
     */
    const offsetAngle = angle + degreePerDirection / 2;

    return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "N"
        : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "NE"
            : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
                : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "SE"
                    : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "S"
                        : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "SW"
                            : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
                                : "NW";
}
