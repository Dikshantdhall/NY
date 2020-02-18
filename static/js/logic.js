var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;
var link = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
var link1 = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
var light = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var baseMaps = {
    "Light Map": light
  };

var healthyStation = 0;
var lowStation = 0;
var emptyStation = 0;
var outOrderStation = 0;
var notInstalled = 0;

function chooseColor(numBike, numBikeInstalled, numBikeRenting){
    if(numBike >= 5){
      return("green")
    }
    else if(numBike < 5 && numBike >0){
      return("orange")
    }
    else if(numBike == 0 && numBikeInstalled == 1){
      return("red")
    }
    else if(numBikeInstalled == 1 && numBikeRenting ==0){
      return("blue")
    }
    else if(!numBikeInstalled){
      return ("yellow")
    }
}
var stationId = [];
d3.json(link).then(d =>{
  d3.json(link1).then(bikes => {
    bikes.data.stations.forEach(d => {
      if(d.num_bikes_available >= 5){
        healthyStation += 1;
      }
      else if(d.num_bikes_available < 5 &&d.num_bikes_available > 0){
        lowStation += 1;
      }
      else if(d.num_bikes_available === 0 &&d.is_installed == 1){
        emptyStation += 1;
      }
      else if(d.is_installed == 1 && d.is_renting == 0){
        outOrderStation += 1;
      }
       else if(!d.is_installed){
        notInstalled += 1;
       }
      
      stationId.push(d.station_id);
      
    })
    var marker =[];
    var marker1 = [];
    var marker2 = [];
    var marker3 = [];
    var marker4 = [];
    for(var i = 0; i < d.data.stations.length; i++){
      if((stationId[i]== d.data.stations[i].station_id) && (bikes.data.stations[i].num_bikes_available>=5)){
       marker.push(L.marker([d.data.stations[i].lat, d.data.stations[i].lon], {icon:
        L.ExtraMarkers.icon({
         icon:"fa-bicycle",
         markerColor: chooseColor(bikes.data.stations[i].num_bikes_available, bikes.data.stations[i].is_installed, bikes.data.stations[i].is_renting),
         shape: 'circle',
         prefix: 'fas'
       })}).bindPopup(`${d.data.stations[i].name}<br>capacity: ${d.data.stations[i].capacity}<br>${bikes.data.stations[i].num_bikes_available} Bikes Available`));
      }

      if((stationId[i]== d.data.stations[i].station_id) && (bikes.data.stations[i].num_bikes_available < 5 &&bikes.data.stations[i].num_bikes_available >0) ){
        marker1.push(L.marker([d.data.stations[i].lat, d.data.stations[i].lon], {icon:
         L.ExtraMarkers.icon({
          icon:"fa-bicycle",
          markerColor: chooseColor(bikes.data.stations[i].num_bikes_available, bikes.data.stations[i].is_installed, bikes.data.stations[i].is_renting),
          shape: 'circle',
          prefix: 'fas'
        })}).bindPopup(`${d.data.stations[i].name}<br>capacity: ${d.data.stations[i].capacity}<br>${bikes.data.stations[i].num_bikes_available} Bikes Available`));
       }

       if((stationId[i]== d.data.stations[i].station_id) && (bikes.data.stations[i].num_bikes_available ==0 &&bikes.data.stations[i].is_installed ==1) ){
        marker2.push(L.marker([d.data.stations[i].lat, d.data.stations[i].lon], {icon:
         L.ExtraMarkers.icon({
          icon:"fa-bicycle",
          markerColor: chooseColor(bikes.data.stations[i].num_bikes_available, bikes.data.stations[i].is_installed, bikes.data.stations[i].is_renting),
          shape: 'circle',
          prefix: 'fas'
        })}).bindPopup(`${d.data.stations[i].name}<br>capacity: ${d.data.stations[i].capacity}<br>${bikes.data.stations[i].num_bikes_available} Bikes Available`));
       }

       if((stationId[i]== d.data.stations[i].station_id) && (bikes.data.stations[i].is_installed ==1 &&bikes.data.stations[i].is_renting ==0) ){
        marker3.push(L.marker([d.data.stations[i].lat, d.data.stations[i].lon], {icon:
         L.ExtraMarkers.icon({
          icon:"fa-bicycle",
          markerColor: chooseColor(bikes.data.stations[i].num_bikes_available, bikes.data.stations[i].is_installed, bikes.data.stations[i].is_renting),
          shape: 'circle',
          prefix: 'fas'
        })}).bindPopup(`${d.data.stations[i].name}<br>capacity: ${d.data.stations[i].capacity}<br>${bikes.data.stations[i].num_bikes_available} Bikes Available`));
       }

       if((stationId[i]== d.data.stations[i].station_id) && (bikes.data.stations[i].is_installed ==0)){
        marker4.push(L.marker([d.data.stations[i].lat, d.data.stations[i].lon], {icon:
         L.ExtraMarkers.icon({
          icon:"fa-bicycle",
          markerColor: chooseColor(bikes.data.stations[i].num_bikes_available, bikes.data.stations[i].is_installed, bikes.data.stations[i].is_renting),
          shape: 'circle',
          prefix: 'fas'
        })}).bindPopup(`${d.data.stations[i].name}<br>capacity: ${d.data.stations[i].capacity}<br>${bikes.data.stations[i].num_bikes_available} Bikes Available`));
       }

    
    }

    bikeStationLayer = L.layerGroup(marker);
    lowStationLayer = L.layerGroup(marker1);
    emptyStationLayer = L.layerGroup(marker2);
    outOrderStationLayer = L.layerGroup(marker3);
    comingSoonLayer = L.layerGroup(marker4);

    
    
    overlayMaps = {
      "Healthy Stations": bikeStationLayer,

      "Coming Soon": comingSoonLayer,
      "Empty Stations":emptyStationLayer,
      "Low Stations": lowStationLayer,
      "Out of Order":outOrderStationLayer


    }
    var myMap = L.map("map-id", {
      center: newYorkCoords,
      zoom: mapZoomLevel,
      layers: [light,bikeStationLayer]
    });

     // Adding Legend to myMap
     var legend = L.control({position: 'bottomright'});
     legend.onAdd = function (myMap) {
       var div = L.DomUtil.create('div', 'legend')
       div.innerHTML +=
     `<p class="out-of-order">Out of Order Stations: ${outOrderStation}</p>
       <p class="coming-soon"> Stations Coming Soon ${notInstalled}</p>
       <p class="empty"> Empty Station : ${emptyStation}</p>
       <p class="low">low Station: ${lowStation}</p>
       <p class="healthy">healthyStation: ${healthyStation}</p>`;
       return div;
     };
     legend.addTo(myMap);


    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  });
 
});





