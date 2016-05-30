// Global variables
var view; 
var map;
var updateCall; 

/**
 * Use d3 to parse a json spec into a Vega spec.
 * Use Vega runtime to parse the Vega spec and generates an interactive
 * visualization with leaflet underneath the visualization.
 */
d3.json("specs/us-airports-mercator.json", function(error, spec) {
  vg.parse.spec(spec, function(error, chart) { 
    view = chart({el:"#viz"}).update(); 
    setDivSize();
    initializeMap();
    adaptViewToMap();
    
    map.on('zoomstart', function(e) {
        console.log("start");
        updateCall = requestAnimationFrame(adaptViewToMap);
    });
    map.on('zoomend', function(e) {
      console.log("end");
      cancelAnimationFrame(updateCall);
    });
    
    map.on('viewreset', function(e) {
      adaptViewToMap();
    });
    map.on('drag', function(e) {
      adaptViewToMap();
    });
  });
});

/**
 * Sets the size of the div contains leaflet to the size of the Vega visualization.
 */
function setDivSize() {
  // Get the paddings to compute final width and height
  var padding = view.padding();
  var finalWidth    = padding.left + padding.right + view.width() + "px";
  var finalHeight   = padding.top + padding.bottom + view.height() + "px";
  
  document.getElementById('mapple').style.width  = finalWidth;
  document.getElementById('mapple').style.height = finalHeight;
}

/**
 * Initialize the leaflet map to contain all points in the Vega visualization
 * with the possible maximum zoom level.
 */
function initializeMap() {
  /*
  Default location is [47.653286, -122.305957]: 
      Paul G. Allen Center for Computer Science & Engineering
  */
  map = L.map('mapple').setView([47.653286, -122.305957], 14);
  mapLink = 
      '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 14,
      }).addTo(map);
  
  // Find the bounds in Vega visualization.
  var geoBounds = view.data('geoBounds').values()[0];  
  var minLat = geoBounds.minLat, 
    maxLat = geoBounds.maxLat, 
    minLon = geoBounds.minLon, 
    maxLon = geoBounds.maxLon;
  var southWest = L.latLng(minLat, minLon),
    northEast = L.latLng(maxLat, maxLon),
    bounds = L.latLngBounds(southWest, northEast);
    
  // Sets the map view to fit the bounds.
  map.fitBounds(bounds);
}

/**
 * Change the signal of the view so that the view is synced with the map.
 */
function adaptViewToMap() {
  console.log("adapt");
  var padding = view.padding();
  view.signal("geoCenterLat", map.getCenter()["lat"]);
  view.signal("geoCenterLon", map.getCenter()["lng"]);
  view.signal("geoScale", (1 << 8 + map.getZoom()) / 2 / Math.PI);
  view.signal("geoTranslateX", map.getSize()["x"] / 2 - padding.left);
  view.signal("geoTranslateY", map.getSize()["y"] / 2 - padding.top);
  view.update();
}
