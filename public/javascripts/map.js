// This is my frontend

var styles = [
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#ff0000"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ff0000"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#ff0000"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#9b30f2"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#7620bd"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#c4c6f4"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#d3d4f3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#000000"
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eeeeff"
            },
            {
                "visibility": "on"
            }
        ]
    }
]

var selectedActivity = {};
var map;
var latLngBounds = [];

function initGoogle() {
  initAutoComplete();
  initMap();
  addMarkersFromDatabase();
}

function initAutoComplete() { // shorthand document.ready function jQuery
  var timeAutocomplete = new google.maps.places.Autocomplete( // This autocomplete is for use in the search within time entry box.
    document.getElementById('search-within-time-text')
  );

  timeAutocomplete.addListener('place_changed', function() {
    // infowindow.close();
    var place = timeAutocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    selectedActivity = {
      google_id: place.id,
      name: place.name,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      phone: place.formatted_phone_number,
      address: place.formatted_address,
      website: place.website
    };
  });
}

function initMap() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: {lat: 37.09024, lng: -95.712891}, // usa
    zoom: 3,
    scrollwheel: false,
    styles: styles
  });
}

$(document).on('submit', '.deleteActivity', function(event) { //everything now has an event builder.  Each knows it has a delete handler
  event.preventDefault();
  var tagID = event.target.children.tagID.value;
  var activityToDeleteID = event.target.children.google_id.value;
  var activityDeleteHashID = {google_id: activityToDeleteID}
  $.post("/trips/" + tagID + "/deleteActivity", activityDeleteHashID, function() {
    $("." + activityToDeleteID).remove();
    latLngBounds = [];
    initMap();
    addMarkersFromDatabase();
  });
})

$('.addActivity').on('submit', function(event) {
  event.preventDefault();
  var tagID = event.target.children.id.value;
  selectedActivity.tagID = tagID;

  $.post( "/trips/addActivity", selectedActivity, function(data) {
    initMap();
    addMarkersFromDatabase();
    addToDo(data, tagID);
    $("#search-within-time-text").val('');
  });
})

$(document).on('submit', '.completedActivity', function(event) {
  event.preventDefault();
  var idsToSend = {
    tagID: event.target.children.tagID.value,
    google_id: event.target.children.google_id.value
  }
  $.post("/trips/" + idsToSend.tagID + "/completeActivity", idsToSend, function(data) {
    initMap();
    addMarkersFromDatabase();
  });
});

function addMarkers(location, tagID) {
  var defaultIcon = makeMarkerIcon('d3d4f3');
  var highlightedIcon = makeMarkerIcon('9b30f2');
  var completedIcon = makeMarkerIcon('a6a6a6');

  var marker = new google.maps.Marker({
    position: {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)},
    title: location.name,
    animation: google.maps.Animation.DROP,
    icon: location.completed ? completedIcon : defaultIcon,
    map: map
  });

  var largeInfowindow = new google.maps.InfoWindow({
    maxWidth: 150
  }); // adding in an info window

  marker.addListener('click', function() {
    populateInfoWindow(this, location, tagID, largeInfowindow);
  });
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(location.completed ? completedIcon : defaultIcon);
  });
}

function addMarkersFromDatabase() {
  var tagID = $(".addActivity").children('input[name=id]').val();
  $.get('/trips/findActivities?tagID=' + tagID , function(data) {
    for (var i = 0; i < data.length; i++) { // Adds all stored markers and does bounds for each
      addMarkers(data[i], tagID);
      makeBoundsForMap(data[i].latitude, data[i].longitude);
    }
  });
}

function populateInfoWindow(marker, info, tagID, infowindow) {
  if (infowindow.marker != marker) { // Check to make sure the infowindow is not already opened on this marker.
    infowindow.marker = marker;
    infowindow.setContent(
      '<div class="info-window">' +
        '<p class="overflow iw-title"><strong>' + info.name + '</strong></p>' +
        '<p>Phone: ' + info.phone + '</p>' +
        '<p class="overflow"><a href="' + info.website + '" target="_blank">' + info.website + '</a></p>' +
        '<form class="deleteActivity">' +
          '<input type="hidden" name="tagID" value="' + tagID + '">' +
          '<input type="hidden" name="google_id" value="' + info.google_id + '">' +
          '<button class="glyphicon glyphicon-trash" aria-hidden="true" type="submit"></button>' +
        '</form>' +
        '<form class="completedActivity">' +
          '<input type="hidden" name="tagID" value="' + tagID + '">' +
          '<input type="hidden" name="google_id" value="' + info.google_id + '">' +
          '<button class="glyphicon glyphicon-ok" aria-hidden="true" type="submit"></button>' +
        '</form>' +
      '</div>'
    )
    infowindow.open(map, marker); // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function makeBoundsForMap(lat, long) {
  var bounds = new google.maps.LatLngBounds(); // makes map start showing bounds
  var newBounds = new google.maps.LatLng({lat: parseFloat(lat), lng: parseFloat(long)});
  latLngBounds.push(newBounds);
  for (var i = 0; i < latLngBounds.length; i++) {
    bounds.extend(latLngBounds[i]);
  }
  map.fitBounds(bounds);
}

function addToDo(activity, tagID) {
  $("#toDo .row").append( // first line works with .name, switching to .id
    '<div class="col-md-3">' +
      '<div class="col-md-12">' +
        '<div class="' + activity.google_id + ' mapcard">' +
          '<p class="overflow"><strong>' + activity.name + '</strong></p>' +
          '<p><a href="' + activity.website + '" target="_blank">Website</a></p>' +
          '<form class="deleteActivity">' +
          '<input type="hidden" name="tagID" value="' + tagID + '">' +
          '<input type="hidden" name="google_id" value="' + activity.google_id + '">' +
          '<p><input class="btn btn-outline-secondary btn-xs mtd-btn" type="submit" value="Delete"/></p>' +
          '</form>' +
          '<form class="completedActivity">' +
          '<input type="hidden" name="tagID" value="' + tagID + '">' +
          '<input type="hidden" name="google_id" value="' + activity.google_id + '">' +
          '<p><input class="btn btn-outline-secondary btn-xs mtc-btn" type="submit" value="completed"/></p>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>'
  )
}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}
