function initMap() {
  var mapOptions = {
    zoom: 6,
    disableDoubleClickZoom: true,
    center: new google.maps.LatLng(51.165, 10.455278),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  if (null != userid) {
    $.getJSON('/json', pointsToMarkers);
  }

  google.maps.event.addListener(map, 'dblclick', createPoint);
}

function pointsToMarkers(data) {
  $.each(data, function(key, val) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(val.loc[0], val.loc[1]),
      map: map,
      title: val.nick,
      draggable: userid == val.userid,
      _id: val._id
    });

    google.maps.event.addListener(marker, 'dragend', updatePoint);
  });
}

function createPoint(event) {
  $.ajax({
    url: '/json/',
    type: 'POST',
    data: {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    },
    success: pointsToMarkers
  });
}

function updatePoint() {
  $.ajax({
    url: '/json/' + this._id,
    type: 'PUT',
    data: {
      lat: this.getPosition().lat(),
      lng: this.getPosition().lng()
    }
  });
};
