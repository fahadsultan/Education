var markers = [];
var quad_colors = {"1": "#2b83ba", "2": "#abdda4", "3": "#d7191c", "4": "#fdae61"};  
var selected_demo = null;
var map = null;

function processData(uni) {
        
    if(uni.demo != selected_demo){
        return;
    }

    const svgMarker = {
        path: "M 0,0 A 5,5 0 1,1 0,-1 Z",
        fillColor: quad_colors[uni.quadrant],
        fillOpacity: 0.7,
        strokeWeight: 1,
        rotation: 0,
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
    // const center = new google.maps.LatLng(39.38413351668238, -99.85744532666118);
    
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