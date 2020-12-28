mapboxgl.accessToken = 'pk.eyJ1IjoieWF1aGVuaWJlaWR1ayIsImEiOiJja2o3b2llMzUwcDNwMnJwNWtuOG82MzlpIn0.cNTogxbQEyS45pQYibK8mA';
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
mapboxClient.geocoding
.forwardGeocode({
query: 'Wellington, New Zealand',
autocomplete: false,
limit: 1
})
.send()
.then(function (response) {
if (
response &&
response.body &&
response.body.features &&
response.body.features.length
) {
var feature = response.body.features[0];
 
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: feature.center,
zoom: 10
});
new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
}
});

