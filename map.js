
// For leaflet
var map = L.map('mapple').setView([-41.2858, 174.78682], 14);
      mapLink = 
          '<a href="http://openstreetmap.org">OpenStreetMap</a>';
      L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; ' + mapLink + ' Contributors',
          maxZoom: 14,
          }).addTo(map);
          
// Vega
var view; // Global variable
d3.json("spec.json", function(error, spec) {
  vg.parse.spec(spec, function(error, chart) { 
    view = chart({el:"#viz"});
    view.update(); 
  });
});
