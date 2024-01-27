var map = L.map('map').setView([33.645, -117.8427], 14);
map.locate({setView: true, maxZoom: 14}); 

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );

map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
    return [lat, lng];
});

// cities
// var cityLayer = L.geoJSON().addTo(map);
// cityLayer.addData(geojsonFeature);

var counties = [
    'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa',
    'Contra Costa', 'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt',
    'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles',
    'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono',
    'Monterey', 'Napa', 'Nevada', 'Orange', 'Placer', 'Plumas', 'Riverside',
    'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco',
    'San Joaquin', 'San Luis Obispo', 'San Mateo', 'Santa Barbara', 'Santa Clara',
    'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus',
    'Sutter', 'Tehama', 'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba'
  ];cities.forEach((city, index) => {
    fetch(`ca/${city}.json`)
        .then(response => response.json())
        .then(data => {
            // Create a GeoJSON layer for the city with a different color based on name length
            L.geoJSON(data, {
                style: {
                    fillColor: getColorBasedOnLength(city.length),
                    color: 'white',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
});
function getColorBasedOnLength(length) {

    var colors = ['red', 'green', 'blue', 'purple', 'orange'];
    return colors[length % colors.length];
}