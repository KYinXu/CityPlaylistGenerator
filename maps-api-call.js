var map = L.map('map').setView([33.645, -117.8427], 14);
map.locate({setView: true, maxZoom: 14}); 
highlightedCounty = ""

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c'],
    minZoom: 6
}).addTo( map );

map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You are at latitude: " + lat + " and longitude: " + lng);
    console.log(highlightedCounty)
    return [lat, lng];
});

fetch('California_County_Boundaries.json')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJSON(data, {
            style: function (feature) {
                return {
                    fillColor: 'transparent',
                    color: 'black',            // Outline color
                    weight: 1.5,                // Outline weight
                    opacity: 1,                 // Outline opacity
                    fillOpacity: 0.3            // Fill opacity
            };
        },
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// function getCounty(lat, lng) {
    
//     fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
//         .then(res => res.json())
//         .then((data) => {
//             console.log(data['features']['properties']['address']['county']);
//         }).catch(err => console.error(err));
// }

map.on('mousedown', function(e) {
    var lat = e.latlng.lat.toFixed(4); 
    var lng = e.latlng.lng.toFixed(4);
    console.log("You CLICKED the map at latitude: " + lat + " and longitude: " + lng);
    // getCounty(lat, lng);
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

var info = L.control();
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#FF4D4D',
        fillColor: '#FF9580',
        dashArray: '',
        fillOpacity: 0.5
    });

    layer.bringToFront();
    highlightedCounty = layer.feature.properties.CountyName;
    if (highlightedCounty == 'Orange') {
        document.getElementById('countyname').innerHTML=highlightedCounty + ' County';
    } else {
        document.getElementById('countyname').innerHTML=highlightedCounty;
    }
    try {
    info.update(layer.feature.properties)
    } catch(TypeError) {
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    try{
        info.update();
    } catch(TypeError) {
    }
    
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    alert('Open spotify playlist here');
    openCountyModal(highlightedCounty);
}

function openCountyModal(countyName) {
    document.getElementById('countyInfo').textContent = 'You clicked on ' + countyName;
    const countyModal = new bootstrap.Modal('#countyModal');
    countyModal.show();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            var countyName = e.target.feature.properties.name;
            openCountyModal(highlightedCounty);
            $('#myModal').remove()
            zoomToFeature(e);
        }
    });
}

var imageUrl = 'https://aas.org/sites/default/files/inline-images/UCI-PACE.png'
imageBounds = [[33.645, -117.8427], [33.645 + 0.01, -117.8427 + 0.01]];

L.imageOverlay(imageUrl, imageBounds).addTo(map);
