// Define the 'map' variable
var map = L.map('map').setView([55.6761, 12.5683], 10);

// Add the base map tile layer from OSM and define the MaxZoom
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch the shipwrecks data from GitHub
fetch("https://raw.githubusercontent.com/AndreaMantegna/GITASS3/main/shipwrecks.geojson")
.then(response => response.json())
.then(shipwrecksData => {
  // Define the shipwrecksLayer with circle markers
  var shipwrecksLayer = L.geoJSON(shipwrecksData, {
    onEachFeature: function (feature, layer) {
      var popupContent = '<div class="popup-content">';
      for (var key in feature.properties) {
        popupContent += '<strong>' + key + ':</strong> ' + feature.properties[key] + '<br>';
      }
      popupContent += '</div>';
      layer.bindPopup(popupContent);
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "blue",
        color: "#000",
        weight: 0.7,
        opacity: 1,
        fillOpacity: 0.2
      });
    }
  });

  // Create a marker cluster group for shipwrecks and add to the map
  var shipwrecksCluster = L.markerClusterGroup();
  shipwrecksCluster.addLayer(shipwrecksLayer);
  map.addLayer(shipwrecksCluster); // Add to map by default

  // Fetch lighthouses data and add as separate layer without clustering
  fetch("https://raw.githubusercontent.com/AndreaMantegna/GITASS3/main/lighthouses.geojson")
  .then(response => response.json())
  .then(lighthousesData => {
    var lighthousesLayer = L.geoJSON(lighthousesData, {
      onEachFeature: function (feature, layer) {
        var popupContent = '<div class="popup-content">';
        for (var key in feature.properties) {
          popupContent += '<strong>' + key + ':</strong> ' + feature.properties[key] + '<br>';
        }
        popupContent += '</div>';
        layer.bindPopup(popupContent);
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 3,
          fillColor: "black",
          color: "white",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error fetching the lighthouses GeoJSON data:', error));

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.backgroundColor = 'white';
  div.style.padding = '6px';
  div.style.border = '1px solid #ccc';
  div.innerHTML = `
    <strong>Legend</strong><br>
    <i style="background: blue; border-radius: 80%; width: 10px; height: 10px; display: inline-block; opacity: 0.5;"></i> Shipwrecks<br>
    <i style="background: black; border: 2px solid white; border-radius: 50%; width: 10px; height: 10px; display: inline-block; opacity: 0.8;"></i> Lighthouses
  `;
  return div;
};

legend.addTo(map);


  // Add a layer control element to the map
  var overlays = {
    "Shipwrecks": shipwrecksCluster,
    "Lighthouses": lighthousesLayer // This needs to be defined after lighthousesLayer is created
  };

  L.control.layers(null, overlays).addTo(map);
})
.catch(error => console.error('Error fetching the shipwrecks GeoJSON data:', error));
