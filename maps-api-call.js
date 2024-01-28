var map = L.map('map').setView([33.645, -117.8427], 14);
map.locate({setView: true, maxZoom: 14}); 

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c'],
    minZoom: 6
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
    //https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=33.6604&lon=-117.8390
    // fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    //     .then(response => response.json())
    //     .then((data) => {
    //         console.log(data['features']['properties']['address']['county']);
    //     }).catch(err => console.error(err));
    var xhr = new XMLHttpRequest();
    console.log('fetching HTTP request')
    xhr.open("GET", `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    xhr.send();
    xhr.onload = ()=> {
        if (xhr.status === 200) {
            const response = JSON.parse(req.response)
            console.log(response)
        }
        else {
            alert(xhr.status);
        }
    }
}


map.on('mousedown', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You CLICKED the map at latitude: " + lat + " and longitude: " + lng);
    getCounty(lat, lng);
    return [lat, lng];
});

var californiaBounds = L.latLngBounds(
    L.latLng(32.5343, -124.4096), // Southwest corner of California
    L.latLng(42.0095, -114.1312)  // Northeast corner of California
);

map.on('zoomend', function () {
    if (map.getZoom() < map.getMinZoom()) {
        map.setZoom(map.getMinZoom());
    } else if (map.getZoom() > map.getMaxZoom()) {
        map.setZoom(map.getMaxZoom());
    }
});

map.on('dragend', function () {
    if (!californiaBounds.contains(map.getCenter())) {
        map.panInsideBounds(californiaBounds, { animate: true });
    }
});
