 mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9
})

console.log(listing.geometry.coordinates);

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red"})
.setLngLat(listing.geometry.coordinates)                  //listing.geometry.coordinates
.setPopup(
    new mapboxgl.Popup({offset: 25  })
    
    .setHTML(
        `<h3>${listing.location}</h3><p>Welcome to wanderlust!</p>`))
    
    .addTo(map);
