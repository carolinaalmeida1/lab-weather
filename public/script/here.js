// Instantiate a map and platform object:
var platform = new H.service.Platform({
  'app_id': 'SdALrBLw0Rp5lUtqlqWn',
  'app_code': '4fG6dYXr9-WVrTq85Ebi3Q'
});
// Retrieve the target element for the map:
var targetElement = document.getElementById('mapContainer');

// Get default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.normal.map,
  {
  zoom: 10,
  center: { lat: -23.5505, lng: -46.6333 }
  });

// Create the parameters for the geocoding request:
var geocodingParams = {
    searchText: 'Avenida Paulista, 500, São Paulo'
  };

// Define a callback function to process the geocoding response:
var onResult = function(result) {
  var locations = result.Response.View[0].Result,
    position,
    marker;
    // console.log(result.Response.View[0].Result)
  // Add a marker for each location found
  for (i = 0;  i < locations.length; i++) {
  position = {
    lat: locations[i].Location.DisplayPosition.Latitude,
    lng: locations[i].Location.DisplayPosition.Longitude
  };
  marker = new H.map.Marker(position);
  map.addObject(marker);
  }
};

// Get an instance of the geocoding service:
var geocoder = platform.getGeocodingService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
geocoder.geocode(geocodingParams, onResult, function(e) {
  alert(e);
});