var markers = [];
var quad_colors = {"1": "#2b83ba", "2": "#abdda4", "3": "#d7191c", "4": "#fdae61"};  
var selected_demo = null;
var map = null;

function processData(uni) {
        
    if(uni.demo != selected_demo){
        return;
    }

    const svgMarker = {
        // path: "M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z",
        // path: "M5 8V17.0192M9 8V17M15 8V17M19 8V17.0192M5 17.0192C5.31428 17 5.70173 17 6.2 17H17.8C18.2983 17 18.6857 17 19 17.0192M5 17.0192C4.60779 17.0431 4.32953 17.097 4.09202 17.218C3.71569 17.4097 3.40973 17.7157 3.21799 18.092C3 18.5198 3 19.0799 3 20.2V21H21V20.2C21 19.0799 21 18.5198 20.782 18.092C20.5903 17.7157 20.2843 17.4097 19.908 17.218C19.6705 17.097 19.3922 17.0431 19 17.0192M3 5.5V8H21V5.5L12 3L3 5.5Z",
        path: "M16 6.28a1.23 1.23 0 0 0-.62-1.07l-6.74-4a1.27 1.27 0 0 0-1.28 0l-6.75 4a1.25 1.25 0 0 0 0 2.15l1.92 1.12v2.81a1.28 1.28 0 0 0 .62 1.09l4.25 2.45a1.28 1.28 0 0 0 1.24 0l4.25-2.45a1.28 1.28 0 0 0 .62-1.09V8.45l1.24-.73v2.72H16V6.28zm-3.73 5L8 13.74l-4.22-2.45V9.22l3.58 2.13a1.29 1.29 0 0 0 1.28 0l3.62-2.16zM8 10.27l-6.75-4L8 2.26l6.75 4z",
        // path: "M 0,0 A 5,5 0 1,1 0,-1 Z",
        fillColor: quad_colors[uni.quadrant],
        fillOpacity: 0.7,
        strokeWeight: 1,
        rotation: 0,
        // scale: 0.1,
        scale: parseInt(uni.INSTSIZE)/1.5,
        anchor: new google.maps.Point(0, 20),
    };

    var latlng = new google.maps.LatLng(uni.LATITUDE, uni.LONGITUD);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: uni.INSTNM,
        icon: svgMarker,
    });

    markers.push(marker);

    // Add info window to the marker
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="firstHeading" class="firstHeading">'+uni.INSTNM+'</h2>'+
    '<div id="bodyContent">'+
    '<p><b>City: </b>'+uni.CITY+'</p>'+
    '<p><b>State: </b>'+uni.STABBR+'</p>'+
    '<p><b>Institute Size: </b>'+uni.INSTSIZE+'/ 5</p>'+
    '<p><b>Quadrant: </b>'+uni.quadrant+'</p>'+
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    // Add event listener to the marker on hover
    marker.addListener("mouseover", () => {
        infowindow.open(map, marker);
    });

    marker.addListener("mouseout", () => {
        infowindow.close();
    });
}

// This example uses SVG path notation to add a vector-based symbol
// as the icon for a marker. The resulting icon is a marker-shaped
// symbol with a blue fill and no border.
function initMap() {

    console.log("Init map");

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    const center = new google.maps.LatLng(40.12143973732901, -102.60036377442854);
    
    if (map == null){

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 5,
            center: center,
        });   

        map.setOptions({styles:[
            {
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "administrative.land_parcel",
              elementType: "labels.text.fill",
              stylers: [{ color: "#bdbdbd" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#eeeeee" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#dadada" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }],
            },
            {
              featureType: "road.local",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }],
            },
            {
              featureType: "transit.station",
              elementType: "geometry",
              stylers: [{ color: "#eeeeee" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
        ]});
    }

    // Get the selected demo 
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {

        if (inputs[i].checked){
            selected_demo = inputs[i].value;
        }
    }

    // Read csv file using d3 and plot the markers
    d3.csv("gmaps_data.csv", processData);

}

window.initMap = initMap;