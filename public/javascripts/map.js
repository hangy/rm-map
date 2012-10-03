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

  google.maps.event.addListener(map, 'rightclick', createPoint);
}

function pointsToMarkers(data) {
  $.each(data, function(key, val) {
    var icon = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + stringToColor(val.userid.toString()));

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(val.loc[0], val.loc[1]),
      map: map,
      icon: icon,
      title: val.nick,
      draggable: userid == val.userid,
      _id: val._id,
      description: val.description,
      userid: val.userid
    });

    google.maps.event.addListener(marker, 'dragend', updatePoint);
    google.maps.event.addListener(marker, 'click', showPointDialog);
  });
}

function createPoint(event) {
  var description = prompt('Worum geht es? (Wohnung, Studium, Arbeit, Hotel Mama, …)');
  if (description) {
    $.ajax({
      url: '/json/',
      type: 'POST',
      data: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        description: description
      },
      success: pointsToMarkers
    });
  }
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

function showPointDialog() {
  var marker = this;

  var dlg = $('<div></div>');
  dlg.attr('title', marker.title + ' @ ' + marker.description);

  var ifr = $('<iframe></iframe>');
  dlg.append(ifr);

  ifr.attr('src', 'http://www.readmore.de/index.php?cont=profile&id=' + marker.userid);
  ifr.attr('height', $(window).height() * 0.9);
  ifr.attr('width',  $(window).width() * 0.9);

  $('body').append(dlg);
  var buttons;
  if (userid == marker.userid) {
    buttons = {
      "Löschen": function() {
        $.ajax({
          url: '/json/' + marker._id,
          type: 'DELETE',
          success: function() {
            marker.setMap(null);
           dlg.dialog('close');
          }
        });
      }
    };
  } else {
    buttons = {};
  }

  dlg.dialog({
    height: ifr.attr('height'),
    width: ifr.attr('width'),
    buttons: buttons,
    close: function(event, ui) {
      $('body').remove(dlg);
    }
  });
};
