let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
  console.log(data);
});

function createMap(earthquakes) {

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let baseMaps = {
    "Street Map": street
  };

  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });

  let legend = L.control({position: 'bottomright'});

    function getColor(d) {
    return d > 1000 ? 'red' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      'red';
    }

  legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
    depths = [-10, 10, 30, 50, 70, 90],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

}

function createMarkers(response) {

  let features = response.features;

  let quakeMarkers = [];

  for (let index = 0; index < features.length; index++) {
    let quake = features[index];

    let color = "";
    if (features[index].geometry.coordinates[2] > 90) {
        color = "red",
        opacity = .5;
    }
    else if (features[index].geometry.coordinates[2] > 70) {
        color = "orange",
        opacity = .5;
    }
    else if (features[index].geometry.coordinates[2] > 50) {
        color = "orange",
        opacity = .3;
    }
    else if (features[index].geometry.coordinates[2] > 30) {
        color = "yellow",
        opacity = .5;
    }
    else if (features[index].geometry.coordinates[2] > 10) {
        color = "green",
        opacity = .3;
    }
    else {
        color = "green",
        opacity = .75;
    }

    let quakeMarker = L.circle([features[index].geometry.coordinates[1], features[index].geometry.coordinates[0]],{
        fillOpacity: opacity,
        color: "black",
        fillColor: color,
        weight: 1,
        radius: (features[index].properties.mag)*20000}
    ).bindPopup(`<h3>${features[index].properties.place}</h3><hr><p>${new Date(features[index].properties.time)}</p>`);

    quakeMarkers.push(quakeMarker);
  }

  createMap(L.layerGroup(quakeMarkers));

}



d3.json(queryUrl).then(createMarkers);