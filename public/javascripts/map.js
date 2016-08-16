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

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
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
      // console.log(place);
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

}

$('#addActivity').on('submit', function(event) {
  event.preventDefault();
  selectedActivity.tagID = event.target.children.id.value
  console.log("selected activity: ", selectedActivity);
  $.post( "/trips/addActivity", selectedActivity, function(data) {
    alert( "Data Loaded: " + JSON.stringify(data) ); // this is the alert that shows up, instead put a div in my page, put response in the div using jquery selector
  });
})
