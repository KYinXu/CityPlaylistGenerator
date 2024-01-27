var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );

navigator.geolocation.watchPosition(success, error);

function success(pos) {

    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    const accuracy = pos.coords.accuracy;
}