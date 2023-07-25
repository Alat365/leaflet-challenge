// Earthquake API link
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Requesting data from URL 
d3.json(url).then(function (data) {
    createFeatures(data.features);
})
  
// Marker colors
function markerColor(depth){
if (depth < 10) return "green";
else if (depth < 30) return "greenyellow";
else if (depth < 50) return "yellow";
else if (depth < 70) return "orange";
else if (depth < 90) return "orangered";
else return "red";
};
  
// Adjusting marker size
function markerSize(magnitude) {
    return magnitude * 10000;
};

function createFeatures(earthquakeData) {
    // Adding popup
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    };

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, coords) {

        let markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            stroke: true,
            weight: 0.5
        }
        return L.circle(coords,markers);
        }
    });
    createMap(earthquakes);
    }

    function createMap(earthquakes) {

    // Create tile layer
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Creating map
    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 10,
        layers: [streetmap, earthquakes]
    });

    // Add legend
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [-10, 10, 30, 50, 70, 90];

      div.innerHTML = '<h4>Depth (km)</h4>';
      // Loop through the depth intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          markerColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);
};