var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = { country: [] };
var MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";

var hostnameRegexp = new RegExp("^https?://.+?/");

//List of Countries and properties
var countries = {
    au: {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4,
  },
  br: {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 3,
  },
  ca: {
    center: { lat: 62, lng: -110.0 },
    zoom: 3,
  },
  fr: {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5,
  },
  de: {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5,
  },
  mx: {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4,
  },
  nz: {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5,
  },
  it: {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5,
  },
  za: {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5,
  },
  es: {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5,
  },
  pt: {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6,
  },
  us: {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 3,
  },
  uk: {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5,
  },
};

function initMap() {
//$("#hotelRadio").prop("checked" , true);
  map = new google.maps.Map(document.getElementById("map"), {
    center: countries ["uk"].center,
    zoom: countries ["uk"].zoom,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
  });

infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content")
});
//Create the autocomplete and associate it with UI input control

autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
        types: ["(cities)"],
        componentRestrictions: countryRestrict,
    }
);
places = new google.maps.places.PlacesService(map);
autocomplete.addListener("place_changed" , onPlacedChanged);
document.getElementById("foodRadio").addEventListener("change" , onPlacedChanged);
document.getElementById("hotelRadio").addEventListener("change" , onPlacedChanged);
document.getElementById("attractionsRadio").addEventListener("change" , onPlacedChanged);
document.getElementById("country").addEventListener("change" , setAutocompleteCountry);
document.getElementById("reset-button").addEventListener("change" , setAutocompleteCountry);
}

function onPlaceChanged() {
    if($("hotelRadio").is(":checked")) {
        var place = autocomplete.getPlace();
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            searchHotel();
        }  else {
            $("#autocomplete").attr("placeholder" , "City");
        }
    }
    else if ($("#foodRadio").is(":checked")) {
        var place = autocomplete.getPlace();
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            searchRestaurant();
        }
    else {
            $("#autocomplete").attr("placeholder" , "City");
        }
    }
    else if ($("#attractionsRadio").is(":checked")) {
        var place = autocomplete.getPlace();
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            searchAttractions();
        }
    else {
        $("#autocomplete").attr("placeholder" , "City");
    }
}

//search for hotels in selected city
function searchHotel() {
    var search = {
        bounds: map.getBounds(),
        types: ["lodging"]
    };
    places.nearbySearch(search, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       clearResults();
       clearMarkers();
       
    // Create a marker for each hotel found, and
    // assign a letter of the alphabetic to each marker
    for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode("A" .charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + ".png";
    //Marker animation to drop the icons
    markers[i] = new google.maps.Marker({
        position: results[i].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: markerIcon
    });
    //If user clicks on marker show details in an info window
    markers[i].placeResult = results[i];
    google.maps.event.addListener(markers[i], "click", showInfoWindow);
    setTimeout(dropMarker(i), i * 100);
    addResult(results[i], i);
    }
}
});
}
//search for restaurants in selected city
function searchRestaurant() {
    var search = {
        bounds: map.getBounds(),
        types: ["restaurants", "bar"]
    };
    places.nearbySearch(search, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       clearResults();
       clearMarkers();
       
    // Create a marker for each restaurant found, and
    // assign a letter of the alphabetic to each marker
    for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode("A" .charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + ".png";
    //Marker animation to drop the icons
    markers[i] = new google.maps.Marker({
        position: results[i].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: markerIcon
    });
    //If user clicks on marker show details in an info window
    markers[i].placeResult = results[i];
    google.maps.event.addListener(markers[i], "click", showInfoWindow);
    setTimeout(dropMarker(i), i * 100);
    addResult(results[i], i);
    }
}
});
}
//search for attractions in selected city
function searchAttractions() {
    var search = {
        bounds: map.getBounds(),
        types: ["museum", "art_gallery", "park"]
    };
    places.nearbySearch(search, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       clearResults();
       clearMarkers();
       
    // Create a marker for each hotel found, and
    // assign a letter of the alphabetic to each marker
    for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode("A" .charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + ".png";
    //Marker animation to drop the icons
    markers[i] = new google.maps.Marker({
        position: results[i].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: markerIcon
    });
    //If user clicks on marker show details in an info window
    markers[i].placeResult = results[i];
    google.maps.event.addListener(markers[i], "click", showInfoWindow);
    setTimeout(dropMarker(i), i * 100);
    addResult(results[i],  i);
    }
}
});
}

function clearMarkers() {
    for (var i = 0; i< markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}

// set the country restrictions based on user input.
// Also center and zoom the map on the given country
function setAutocompleteCountry () {
    var country = $("#country").val();
    if (country == "all") {
        autocomplete.setComponentRestrictions ({ country: [] });
        map.setCenter({ lat: 15, lng: 0});
        map.setZoom(2);
    } else {
        autocomplete.setComponentRestrictions ({ country: country });
        map.setCenter(countries[country].center);
        map.setZoom(countries[country].zoom);
    }
    clearResults();
    clearMarkers();
}

function dropMarker(i) {
    return function () {
        markers[i].setMap(map);
    };
}

//Adds found results
function addResults(result, i) {
    var results = document.getElementById("results");
    var markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    var markerIcon = MARKER_PATH + markerLetter + ".png";
    var tr = document.createElement("tr");
    tr.style.backgroundColor = (i % 2 === 0 ? "#F0F0F0" : "#FFFFFF");
    tr.onclick = function() {
        google.map.event.trigger(markers[i], "click");
    };
    var iconTd = document.createElement("td");
    var nameTd = document.createElement("td");
    var icon = document.createElement("img");
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}

function clearResults() {
    var results = document.getElementById("results");
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}
}

