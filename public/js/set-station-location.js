function setStationLocation() {
    let address = $("#set_station_location_address_input").val();
    console.log(address);
    let geocoder = new google.maps.Geocoder();
    let elevationService = new google.maps.ElevationService;
    geocoder.geocode({address: address}, function (results, status) {
        if (status === "OK") {
            let lat = results[0].geometry.location.lat();
            let lng = results[0].geometry.location.lng();
            console.log("Latitude: " + lat + "\nLongitude: " + lng);

            elevationService.getElevationForLocations({
                'locations': [{lat: lat, lng: lng}]
            }, function (results, status) {
                // Sweet, both the geocoding and elevation request went through.
                if (status === "OK") {
                    // Get it from the results
                    let elevation = results[0].elevation;
                    console.log("Elevation: " + elevation);

                    // Send elevation and coords to the API
                    $.ajax({
                        headers: { "Accept": "application/json"},
                        type: 'POST',
                        url: 'http://127.0.0.1:3000/set-station-location',
                        crossDomain: true,
                        data: {
                            lat: lat,
                            lng: lng,
                            elev: elevation,
                        },
                        beforeSend: function(xhr){
                            xhr.withCredentials = true;
                        },
                        success: function(data, textStatus, request){
                            // Awesome, we were able to send the coords and elevation to the API!
                            // Change the border to success (green) for 2 seconds
                            let $stationLocationCard = $('#station_location_card');
                            $stationLocationCard.removeClass("border-left-warning");
                            $stationLocationCard.addClass("border-success");
                            setTimeout(function () {
                                $stationLocationCard.removeClass("border-success");
                                $stationLocationCard.addClass("border-left-warning");
                            }, 2000)
                        },
                        error: function (err) {
                            console.log("Couldn't set station location.");
                            console.log(err);
                        }
                    });
                } else {
                    console.log("Something went wrong while obtaining elevation. Only submitting latitude and longitude.");
                    // Send the lat, lng, and elevation to the API
                    jQuery.post("http://127.0.0.1:3000/set-station-location", {
                        lat: lat,
                        lng: lng
                    }, function (data, status, xhr) {
                        // Change the border to warning (yellow) for 2 seconds
                        let $stationLocationCard = $('#station_location_card');
                        $stationLocationCard.removeClass("border-left-warning");
                        $stationLocationCard.addClass("border-warning");
                        setTimeout(function () {
                            $stationLocationCard.removeClass("border-warning");
                            $stationLocationCard.addClass("border-left-warning");
                        }, 2000)
                    }, "json")
                }
            })

        } else {
            console.log("Something went wrong while getting coords from address. Not submitting anything.");
            // Change the border to error (red) for 2 seconds
            let $stationLocationCard = $('#station_location_card');
            $stationLocationCard.removeClass("border-left-warning");
            $stationLocationCard.addClass("border-error");
            setTimeout(function () {
                $stationLocationCard.removeClass("border-error");
                $stationLocationCard.addClass("border-left-warning");
            }, 2000)
        }
    })
}