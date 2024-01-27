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
    getCounty(lat,lng);
    return [lat, lng];
});

// cities
// var cityLayer = L.geoJSON().addTo(map);
// cityLayer.addData(geojsonFeature);

function getCounty(lat, lng) {
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data['features']['address']['county']);
        }).catch(err => console.error(err));
}