var map = L.map('map').setView([33.645, -117.8427], 14);
map.locate({setView: true, maxZoom: 14}); 

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );

map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You are at latitude: " + lat + " and longitude: " + lng);
    return [lat, lng];
});

fetch('California_County_Boundaries.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                fillColor: 'transparent',
                color: 'black',            // Outline color
                weight: 1.5,                // Outline weight
                opacity: 1,                 // Outline opacity
                fillOpacity: 0.3            // Fill opacity
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

function getColorBasedOnLength(length) {

    var colors = ['red', 'green', 'blue', 'purple', 'orange'];
    return colors[length % colors.length];
}

function getCounty(lat, lng) {
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data['features']['properties']['address']['county']);
        }).catch(err => console.error(err));
}

map.on('mousedown', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You CLICKED the map at latitude: " + lat + " and longitude: " + lng);
    getCounty(lat, lng);
    return [lat, lng];
});