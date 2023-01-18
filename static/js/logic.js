function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    // var darkmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    //   attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    // });
    var lightmap = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      // "Dark Mode": darkmap,
      "Light Mode": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    var map = L.map("map-id", {
      center: [51.00, -100.63],
      zoom: 4,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false,
      position: 'bottomright'
    }).addTo(map);

    
  }

function markerSize(magnitude) {
    var magn = (magnitude * magnitude) * 4000
    magn = magn || 0
    return  magn;
  }

function markerColor(depth) {
  switch(true) {
    case depth > 40:
      return "#3c6698"
      break;
    case depth >10:
      return "#9661b1"
      break;
    default:
      return "#da6c42"
  }
}
  
  
function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    var earthquake_feats = response.features;
  
    // Initialize an array to hold the bike markers.
    var earthquakeMarkers = [];
    var mags = [];
    var depths = [];
    
    // Loop through the stations array.
    for (var index = 0; index < earthquake_feats.length; index++) {
      var earthquake = earthquake_feats[index];
      var depth = markerColor(earthquake.geometry.coordinates[2])
      // For each station, create a marker, and bind a popup with the station's name.
      var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
        stroke: true,
        fillOpacity: 0.75,
        color: "white",
        weight: .5,
        fillColor: markerColor(earthquake.geometry.coordinates[2]),
        radius: markerSize(earthquake.properties.mag)
      }).bindPopup("<h4>" + earthquake.properties.place + "</h4>" +  "<h4>" + "Magnitude: " + earthquake.properties.mag + "</h4>" + "<h4>"+"Depth: " + earthquake.geometry.coordinates[2] +" km"+ "</h4>");
      
       // var earthquakeMarker =[earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]]
      // Add the marker to the bikeMarkers array.
      earthquakeMarkers.push(earthquakeMarker);

      depths.push(depth)

     
    }
  
    
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));

    console.log(depths)
  }
  
  
// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  