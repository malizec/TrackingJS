$(document).ready(function(e){
 
  alert();
  // =========================================== //
  // ================= TRACK USER ============== //
  // =========================================== //

  // var base_url = 'http://localhost/tuscan/';
  var base_url = 'http://localhost/tracking.js/';
  var api_url = base_url + 'api/data.php';


  // RETURN MAX NoACTIVITY VALUE FROM REST API AND COMPARE WITH LAST TIME INPUT INTO DB LOG VALUE
  if ( $('#options').html() ) {

    setInterval(function(){
      trackJS();
      track_style();
    }, 60000);

    $.get(api_url + "?action=return-data&options=get_options&option_name=pausa1", function(data, status){
      setInterval(checkNoActivityTime, data.option_value*60*1000); 
    });

  }

  if ( $('#radnik_id').html() ) {
    var radnik_id = $('#radnik_id').html();
    var working_session_id = $('#working_session_id').html();

    function trackJS() {
      // console.log('Tracking started...');
      var d = new Date();
      var n = d.getTime();

      ajaxCall();

      // console.log(n);
    }

    function track_style() {
      
      var a = ['onchange', 'onclick', 'onmouseover', 'onmouseout', 'onload', 'click', 'focus', 'change', 'keypress'];
      a.forEach(function(element) {
        document.addEventListener(element, trackJS);
      });

      // add event listener
      // object.addEventListener("keypress", myScript);
    }
    
    track_style();

    var max_neaktivnost = '0';

    function ajaxCall() {
      $.ajax({
        url: api_url + "?action=user_activity",
        method: "POST",
        data: {
          radnik_id: radnik_id,
          working_session_id: working_session_id
        },
        beforeSend: function( xhr ) {
          xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
      })
      .done(function( data ) {

        // console.log( data );
        var data = JSON.parse(data);
        // console.log(data);
        // if ( data.login_status === 'false' ) {
        //   window.location = base_url + 'logout.php';
        // }
        // console.log('Tracking ended.');
      });
    }

    $.get(api_url + "?action=return-data&options=get_options&option_name=max_neaktivnost", function(data, status){
      var noActivityTime = data.option_value;

      setInterval(checkNoActivityTime, noActivityTime*60*1000); //300000 MS == 5 minutes
    });


    function checkNoActivityTime() {
      console.log('Tracking NoActivity started.');

      $.ajax({
        url: api_url + "?action=check_user_noactivity",
        method: "POST",
        data: {
          radnik_id: radnik_id,
          working_session_id: working_session_id
        },
        beforeSend: function( xhr ) {
          xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
      })
      .done(function( data ) {
        var data = JSON.parse(data);
        // console.log(data);
        if ( data['no_activity_status'] === 'true' ) {
          window.location = base_url + 'logout.php';
        }
        // console.log('Tracking NoActivity ended.');
      });

    }


  }
});