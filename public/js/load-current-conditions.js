$(function () {
    refreshData();
});

function refreshData() {
    $.ajax({
        headers: { "Accept": "application/json"},
        type: 'GET',
        url: 'http://127.0.0.1:3000/current-observations',
        crossDomain: true,
        beforeSend: function(xhr){
            xhr.withCredentials = true;
        },
        success: function(data, textStatus, request){
            console.log(data);
            let observations = data.observations[0];
            let imperial = observations.imperial;
            let temp = imperial.temp + " °F"
            let humidity = observations.humidity + " %"
            let atmosphericPressure = imperial.pressure + " inHg";
            let windSpeed = imperial.windSpeed + " mph"
            let windDir = getCardinal(observations.winddir);
            let windSpeedDir = windSpeed + " " + windDir;
            console.log(windSpeedDir);
            $("#current_temp").text(temp);
            $("#current_humidity").text(humidity);
            $("#current_atmospheric_pressure").text(atmosphericPressure);
            $("#current_wind_speed_dir").text(windSpeedDir);
        },
        error: function (err) {
            console.log("Couldn't query API.");
            console.log(err);
        }
    });
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