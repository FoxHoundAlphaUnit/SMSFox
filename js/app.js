// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

	// We'll ask the browser to use strict code to help us catch errors earlier.
	// https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
	'use strict';

	var e = document.getElementById('nav-slide');
	if (e != null){
		console.log('Successfully retrieved nav-slide');
		$("#nav-slide").load("../slide.html");
	} else {
		console.log('Error while retrieving nav-slide');
	}
  
	/* log the result */
	function logMsg(msg){
		var r = "";
		['type', 'id', 'threadId', 'body', 'delivery', 'deliveryStatus', 'read', 'receiver', 'sender', 'timestamp', 'messageClass'].forEach(function (key){
			r += '<br> ' + key + ': ' + msg[key];
		});
		console.log(r);
	}

	var last_sms_id = -1;

	$('#sms-submit').on("click", function (ev){
		console.log("Submitting SMS form...");
		
		var resp = document.getElementById('response');
		if (resp == null) {
			$("#main-section").append('<div class="row"><div id="response"></div></div>');
		}
		$("#response").html("Submitting SMS...");
		
		var msg = document.getElementById('message').value;
		var phone = document.getElementById('contacts').value;
		console.log('Submitted message : ' + msg + ' Phone nb: ' + phone);
		
		var request;
		request = navigator.mozMobileMessage.send(phone, msg);
		
		request.onsuccess = function (){
			window.thing = this;
			console.log(this.result);
			console.log("Sent to: " + this.result);
			last_sms_id = this.result['id'];
			logMsg(this.result);
			$("#response").html("<span>Successfully sent ✓</span><br/>")
			
			/* check if the last sms was well delivered (receipt) */
			var checking_last_sms = window.setInterval(function(){
				if (last_sms_id != -1){
					var request = navigator.mozMobileMessage.getMessage(last_sms_id);
					request.onsuccess = function (){
						window.thing = this;
						console.error(this.result);
						
						if (this.result['deliveryStatus'] == 'success'){
							clearInterval(checking_last_sms);
							$("#response").append("<span>Successfully received ✓</span>");
						}
						
						logMsg(this.result);
					}
			
					request.onerror = function (){
						$("#response").html('<span>Couldn\'t retrieve last sent SMS...</span>');
						clearInterval(checking_last_sms);
					}
				}
			}, 5000);
		};
		
		request.onerror = function (){
			window.thing = this;
			console.error(this.error.name);
			console.error(this.error.message);
			$("#response").html('<span>Error while sending the message ✗</span>');
			$("#response").append('<span>' + this.error.name + ':' + this.error.message + '</span>');
		};
	});
	
	
  
  var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);

  // ---

  function start() {

    $('.button-collapse').sideNav({
      menuWidth: 200, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
	
	
	var allContacts = navigator.mozContacts.getAll();
	allContacts.onsuccess = function(event) {
		var cursor = event.target;
		var gn, fn, tl;
		if (cursor.result) {
			console.log("Found one contact...");
			gn = (cursor.result.givenName == null) ? "" : cursor.result.givenName[0]
			fn = (cursor.result.familyName == null) ? "" : cursor.result.familyName[0]
			tl = (cursor.result.tel == null) ? "" : cursor.result.tel[0].value
			console.log('Given name : ' + gn + ', Family name : ' + fn + ', Tel : ' + tl);
			
			// Append new contact to the select
			$('#contacts').append('<option value="' + tl + '">' + gn + ' ' + fn + '</option>');
			
			// Go to the next contact
			cursor.continue();
		} else {
			console.log("No more contacts, creating the Materialize select...");
			// Once the contacts are all retrieved, we create the Materialize select
			$('select').material_select();
		}
	};
	
	allContacts.onerror = function() {
		console.warn("Something went terribly wrong while retrieving the contacts!");
	};

    // var message = document.getElementById('message');
    // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
    // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations
    // message.textContent = translate('message');

  }

});


