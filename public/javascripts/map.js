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
var markers = [];
var map;

function initMap() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: {lat: 47.680, lng: -122.330},
    zoom: 15,
    styles: styles
  });

  // This autocomplete is for use in the search within time entry box.
  var timeAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search-within-time-text'));

    timeAutocomplete.addListener('place_changed', function() {
      // infowindow.close();
      // marker.setVisible(false);
      var place = timeAutocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      selectedActivity = {
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        phone: place.formatted_phone_number,
        address: place.formatted_address,
        photo_url: place.url,
        website: place.website
      };
    });
    addMarkersFromDatabase();
    // make outside function in here call function that will gather markers, use ajax
    // new route that calls activity model that returns json
}

$('#addActivity').on('submit', function(event) {
  event.preventDefault();
  selectedActivity.tagID = event.target.children.id.value
  console.log("selected activity: ", selectedActivity);
  $.post( "/trips/addActivity", selectedActivity, function(data) {
    $("#toDo").append(
      '<div>' +
        '<p><a href="#">' + selectedActivity.name + '</a></p>' +
        '<p>' + selectedActivity.address + '</p>' +
        '<p>' + selectedActivity.phone + '</p>' +
        '<p><a href="' + selectedActivity.website + '">Website</a></p>' +
      '</div><br/><br/>'
    )
    addMarkers(selectedActivity);
  });
})

function addMarkers(location) {
  var marker = new google.maps.Marker({
    position: {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)},
    title: location.name,
    animation: google.maps.Animation.DROP,
    // icon: ('0091ff'),
    map: map
  });
  // console.log(marker);
}

function addMarkersFromDatabase() {
  var tagID = $("#addActivity").children('input[name=id]').val();
  $.get('/trips/findActivities?tagID=' + tagID , function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      addMarkers(data[i]);
    }
  });
}
