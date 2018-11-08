$(document).ready(function () {
  var platform = new H.service.Platform({
    "app_id": "SdALrBLw0Rp5lUtqlqWn",
    "app_code": "4fG6dYXr9-WVrTq85Ebi3Q"
  });

  var targetElement = document.getElementById("mapContainer");

  var defaultLayers = platform.createDefaultLayers();

  $(".search-btn").click(function () {
    getLocation();
  });

  const geocoder = platform.getGeocodingService();

  function getLocation() {
    const startVal = $(".search").val();
    const geocodingParams = {
      searchText: startVal
    };

    return geocoder.geocode(geocodingParams, getStartGeoLocation, function (e) {
      alert(e);
    });
  }

  function getStartGeoLocation(result) {
    const locations = result.Response.View[0].Result;

    const localStartLat = locations[0].Location.DisplayPosition.Latitude;
    const localStartLng = locations[0].Location.DisplayPosition.Longitude;

    return drawMap(localStartLat, localStartLng);
  };

  function drawMap(s, e) {
    $("#mapContainer").html("");

    const map = new H.Map(
      targetElement,
      defaultLayers.normal.map,
      {
        zoom: 14,
        center: { lat: s, lng: e }
      }
    );

    const onResult = function (result) {
      let route,
        startPoint;

      route = result.response

      startPoint = route.waypoint[0].mappedPosition;

      const startMarker = new H.map.Marker({
        lat: startPoint.latitude,
        lng: startPoint.longitude
      });

      map.addObjects(startMarker);
    };
  };
});