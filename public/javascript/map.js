mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: loc.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(loc.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${loc.title}</h3><p>${loc.location}</p>`
            )
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());