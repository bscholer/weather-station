function setStationLocation() {
    let address = $("#set_station_location_address_input").val();
    console.log(address);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address}, function (results, status) {
        if (status === "OK") {
            let lat = results[0].geometry.location.lat();
            let lng = results[0].geometry.location.lng();
            console.log(lat + ", " + lng);
            jQuery.post("http://127.0.0.1:3000/set-station-location", {lat: lat, lng: lng}, function (data, status, xhr) {

            }, "json")

        } else {
            console.log("Something went wrong while geocoding address");
        }
    })
}