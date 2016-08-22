// This is my frontend

var styles = [
  {
    featureType: 'water',
    stylers: [
      { color: '#19a0d8' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { weight: 6 }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -40 }
    ]
  },{
    featureType: 'transit.station',
    stylers: [
      { weight: 9 },
      { hue: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'on' },
      { color: '#f0e4d3' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -25 }
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
    //// rerender all activies
    // $.get all activities
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

  $("#toDo").empty();
  $.post( "/trips/addActivity", selectedActivity, function(data) {
    console.log("this is data: ", data);
    initMap();
    addMarkersFromDatabase();
    for (var i = 0; i < data.length; i++) {
      addToDo(data[i], tagID);
    }
    $("#search-within-time-text").val('');
  });
})

$('.completedActivity').on('submit', function(event) {
  event.preventDefault();
  var idsToSend = {
    tagID: event.target.children.tagID.value,
    google_id: event.target.children.google_id.value
  }
  console.log("you clicked completedActivity");
  $.post("/trips/" + idsToSend.tagID + "/completeActivity", idsToSend, function(data) {

  });
});

function addMarkers(location, tagID) {
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  var completedIcon = makeMarkerIcon('8c8c8c');

  var marker = new google.maps.Marker({
    position: {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)},
    title: location.name,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon,
    map: map
  });

  var largeInfowindow = new google.maps.InfoWindow(); // adding in an info window

  marker.addListener('click', function() {
    populateInfoWindow(this, location, tagID, largeInfowindow);
  });
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
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
      '<div><p>' + info.name + '</p><p>Phone: ' + info.phone + '</p><p>Website: ' + info.website + '</p>' +
        '<form class="deleteActivity">' +
          '<input type="hidden" name="tagID" value="' + tagID + '">' +
          '<input type="hidden" name="google_id" value="' + info.google_id + '">' +
          '<button class="glyphicon glyphicon-trash" aria-hidden="true"></button>' +
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
  $("#toDo").append( // first line works with .name, switching to .id
    '<div class="' + activity.google_id + '">' +
    '<p><a href="#">' + activity.name + '</a></p>' +
    '<p>' + activity.address + '</p>' +
    '<p>' + activity.phone + '</p>' +
    '<p><a href="' + activity.website + '">Website</a></p>' +
    '<form class="deleteActivity">' +
    '<input type="hidden" name="tagID" value="' + tagID + '">' +
    '<input type="hidden" name="google_id" value="' + activity.google_id + '">' +
    '<p><input class="btn btn-secondary" type="submit" value="Delete"/></p>' +
    '</form>' +
    '</div><br/><br/>'
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
