var view; // Global variable
d3.json("specs/us-airports.json", function(error, spec) {
  vg.parse.spec(spec, function(error, chart) { 
    view = chart({el:"#viz"}).update(); 
    setTileSize();
    parseMap();
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

function parseMap() {
  // For leaflet
  var map = L.map('mapple').setView([-41.2858, 174.78682], 14);
      mapLink = 
          '<a href="http://openstreetmap.org">OpenStreetMap</a>';
      L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; ' + mapLink + ' Contributors',
          maxZoom: 14,
          }).addTo(map);
}
