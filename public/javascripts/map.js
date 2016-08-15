var styles = require('./mapstyles.js')

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
      center: {lat: 47.680, lng: -122.330},
      zoom: 15,
      style: styles
  });

  // This autocomplete is for use in the search within time entry box.
  var timeAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search-within-time-text'));
}
