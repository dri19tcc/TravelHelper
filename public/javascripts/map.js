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

    timeAutocomplete.addListener('place_changed', function() {
      // infowindow.close();
      // marker.setVisible(false);
      var place = timeAutocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      console.log(place);
    });
    // GetLatlong()
  
}

  // function GetLatlong() {
  //   var geocoder = new google.maps.Geocoder();
  //   var address = document.getElementById(('search-within-time-text').value;
  //
  //   geocoder.geocode({ 'address': address }, function (results, status) {
  //
  //       if (status == google.maps.GeocoderStatus.OK) {
  //           var latitude = results[0].geometry.location.lat();
  //           var longitude = results[0].geometry.location.lng();
  //
  //       }
  //   });
  // }
