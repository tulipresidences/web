// This script initializes the Google Maps API
function initMap() {
    var tulip = { lat: 40.7128, lng: -74.0060 };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 15, center: tulip });
    var marker = new google.maps.Marker({ position: tulip, map: map });
}
