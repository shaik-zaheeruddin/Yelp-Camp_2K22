// mapboxgl.accessToken = token;
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/light-v10', // style URL
//     center: loc.geometry.coordinates, // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });
// map.addControl(new mapboxgl.NavigationControl());
// new mapboxgl.Marker()
//     .setLngLat(loc.geometry.coordinates)
//     .setPopup(
//         new mapboxgl.Popup({ offset: 25 })
//             .setHTML(
//                 `<h3>${loc.title}</h3><p>${loc.location}</p>`
//             )
//     )
//     .addTo(map)



// console.log(loc.geometry.coordinates)
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)

console.log(campground.geometry.coordinates)