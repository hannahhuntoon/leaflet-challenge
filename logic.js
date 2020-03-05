let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// read in the data from the URL
d3.json(url, function(data) {
    // Send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
  
    // Create pop-ups with specific info about the earthquake 
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>Magnitutde of Earthquake: " + feature.properties.mag + "</p>");
    }
  
    
  
    // Create a layer containing the features array on the earthquakeData object
    // Run the onEachFeature function across all data 
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        let color;
        let r = 255;
        let g = Math.floor(255-80*feature.properties.mag);
        let b = Math.floor(255-80*feature.properties.mag);
        color= "rgb("+r+" ,"+g+","+ b+")"
        
        let geojsonMarkerOptions = {
          radius: 4*feature.properties.mag,
          fillColor: color,
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    });
  
  
    // Use createMap function for earthquake data 
    createMap(earthquakes);
    
  }
  
  function createMap(earthquakes) {
  
    // Pull in MapBox API and api key 
    let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiaGFubmFoaHVudG9vbiIsImEiOiJjazZ4cmZicjMwOWg3M2ZtbTlrN2xpMHEwIn0." +
      "f1G3vEhSnDMvJFeqmF8jyA");

    
  
    // Define a baseMaps object to hold our base layers
    let baseMaps = {
      "Street Map": streetmap
    };
  
    
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Combine basemap and overlay to generate one map that displays the data 
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });
  
  
    function getColor(d) {
        return d < 1 ? 'rgb(255,255,255)' :
              d < 2  ? 'rgb(255,225,225)' :
              d < 3  ? 'rgb(255,195,195)' :
              d < 4  ? 'rgb(255,165,165)' :
              d < 5  ? 'rgb(255,135,135)' :
              d < 6  ? 'rgb(255,105,105)' :
              d < 7  ? 'rgb(255,75,75)' :
              d < 8  ? 'rgb(255,45,45)' :
              d < 9  ? 'rgb(255,15,15)' :
                          'rgb(255,0,0)';
    }
  
    // Create legend 
    let legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];
  
        div.innerHTML+=' Earthquake Magnitude<br><hr>'
    
        // loop through data and create labels for the legend 
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
  
  }
  