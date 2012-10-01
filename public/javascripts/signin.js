function initSignin() {
  $('#signin-form').dialog({
    autoOpen: null == userid,
    modal: true,
    buttons: {
      'Einloggen': function() {
        var options = {
          success: function(data) {
            $.getJSON('/json', function(data) {
              pointsToMarkers(data);
              $('#signin-form').dialog('close');
            });
          },
          statusCode: {
            500: function() {
              alert('Nein.');
            }
          }
        };
        $('#signin-form form').ajaxSubmit(options);
      }
    }
  });
}
