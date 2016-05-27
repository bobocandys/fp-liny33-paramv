// Global variables
var view; 
var map;

d3.json("specs/us-airports-mercator.json", function(error, spec) {
  vg.parse.spec(spec, function(error, chart) { 
    view = chart({el:"#viz"}).update(); 
    setTileSize();
    parseMap();
    adaptViewToMap();
    map.on('move', function(e) {
      adaptViewToMap();
    });
  });
});

function setTileSize() {
  // Get the paddings
  var topPadding    = view.padding().top;
  var leftPadding   = view.padding().left;
  var rightPadding  = view.padding().right;
  var bottomPadding = view.padding().bottom; 
  var finalWidth    = leftPadding + rightPadding + view.width() + "px";
  var finalHeight   = topPadding + bottomPadding + view.height() + "px";
  
  document.getElementById('mapple').style.width  = finalWidth;
  document.getElementById('viz').style.width     = finalWidth;
  document.getElementById('mapple').style.height = finalHeight;
  document.getElementById('viz').style.height    = finalHeight;
}

 // For leaflet
function parseMap() {
  /*
  {s} means one of the available subdomains
  {z} — zoom level
  {x} and {y} — tile coordinates
  */
  map = L.map('mapple').setView([47.653286, -122.305957], 14);
  mapLink = 
      '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 14,
      }).addTo(map);
  
  // Have leaflet zoom to fit all the data points
  var geoBounds = view.data('geoBounds').values()[0];  
  var minLat = geoBounds.minLat, 
    maxLat = geoBounds.maxLat, 
    minLon = geoBounds.minLon, 
    maxLon = geoBounds.maxLon;
  var southWest = L.latLng(minLat, minLon),
    northEast = L.latLng(maxLat, maxLon),
    bounds = L.latLngBounds(southWest, northEast);

  map.fitBounds(bounds);
}

function adaptViewToMap() {
  // Works fine without padding in the spec
  view.signal("geoCenterLat", map.getCenter()["lat"]);
  view.signal("geoCenterLon", map.getCenter()["lng"]);
  view.signal("geoScale", (1 << 8 + map.getZoom()) / 2 / Math.PI);
  view.signal("geoTranslateX", map.getSize()["x"] / 2)
  view.signal("geoTranslateY", map.getSize()["y"] / 2);
  view.update();
}
