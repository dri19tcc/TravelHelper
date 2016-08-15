var styles = require('./mapstyles.js')

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
      center: {lat: 47.680, lng: -122.330},
      zoom: 15,
      style: styles
  });
}
