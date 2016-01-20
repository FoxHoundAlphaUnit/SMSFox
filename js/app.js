var last_sms_id = -1;
var httpServer = new HTTPServer(8080);

// Logging the result from messages
function logMsg(msg){
	var r = "";
	['type', 'id', 'threadId', 'body', 'delivery', 'deliveryStatus', 'read', 'receiver', 'sender', 'timestamp', 'messageClass'].forEach(function (key){
		r += '<br> ' + key + ': ' + msg[key];
	});
	console.log(r);
}

// Not very beautiful, but for now, it is OK
function update_loc(){
	$('[data-l10n-id]').each(function(index){
		$(this).html(navigator.mozL10n.get($(this).attr('data-l10n-id')));
	});
}

function load_page(requested_page){
	console.log('Loading page ' + requested_page);
	if (requested_page == "about"){
		$("#main-container").load("../content/about_content.html", function() {
			console.log('Loading of the HTML performed');
			update_loc();
		});
	} else if (requested_page == "server"){
		$("#main-container").load("../content/server_content.html", function() {
			console.log('Loading of the HTML performed');
			update_loc();
	
			var status = document.getElementById('server-status');
			var ip     = document.getElementById('ip-address');
			var port   = document.getElementById('listening-port');
			var start  = document.getElementById('start-server');
			var stop   = document.getElementById('stop-server');

			console.log('1');
			IPUtils.getAddresses(function(ipAddress) {
				ip.textContent = ip.textContent || ipAddress;
			});
			
			console.log('2');
			port.textContent = httpServer.port;
			console.log('3');
			
			// may be to modify, when the server is correctly running
			status.textContent = navigator.mozL10n.get('stopped');

			start.addEventListener('click', function() {
			  	httpServer.start();
				status.textContent = navigator.mozL10n.get('running');
			});

			stop.addEventListener('click', function() {
			  	httpServer.stop();
				status.textContent = navigator.mozL10n.get('stopped');
			});
			
		});
	} else if (requested_page == "settings"){
		$("#main-container").load("../content/settings_content.html", function() {
			console.log('Loading of the HTML performed');
			update_loc();
			$('select').material_select();
			
			$("#select-language").change(function() {
				var l = $("#select-language").val();
				console.log('New selected language: ' + l);
				navigator.mozL10n.language.code = l;
			});
		});
	} else {
		$("#main-container").load("../content/index_content.html", function() {
			console.log('Loading of the HTML performed');
			update_loc();
			
			last_sms_id = -1;

			$('#sms-submit').on("click", function (ev){
				console.log("Submitting SMS form...");

				var resp = document.getElementById('response');
				if (resp == null) {
					$("#main-section").append('<div class="row"><div id="response"></div></div>');
				}
				$("#response").html(navigator.mozL10n.get('submitting_sms') + '...');

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
					$("#response").html('<span>' + navigator.mozL10n.get('successfully_sent') + ' ✓</span><br/>');
	
					/* check if the last sms was well delivered (receipt) */
					var checking_last_sms = window.setInterval(function(){
						if (last_sms_id != -1){
							var request = navigator.mozMobileMessage.getMessage(last_sms_id);
							request.onsuccess = function (){
								window.thing = this;
								console.error(this.result);
				
								if (this.result['deliveryStatus'] == 'success'){
									clearInterval(checking_last_sms);
									$("#response").append('<span>' + navigator.mozL10n.get('successfully_received') + ' ✓</span>');
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
					$("#response").html('<span>' + navigator.mozL10n.get('error_sending_message') + ' ✗</span>');
					$("#response").append('<span>' + this.error.name + ':' + this.error.message + '</span>');
				};
			});

			var allContacts = navigator.mozContacts.getAll();

			allContacts.onsuccess = function(event) {
				var cursor = event.target;
				var gn, fn, tl;
				if (cursor.result) {
					gn = (cursor.result.givenName == null) ? "" : cursor.result.givenName[0]
					fn = (cursor.result.familyName == null) ? "" : cursor.result.familyName[0]
					tl = (cursor.result.tel == null) ? "" : cursor.result.tel[0].value
					console.log('Found one contact... Given name : ' + gn + ', Family name : ' + fn + ', Tel : ' + tl);
	
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
		});
	}
}

// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

	// We'll ask the browser to use strict code to help us catch errors earlier.
	// https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
	'use strict';

	
	httpServer.addEventListener('request', function(evt) {
		var request  = evt.request;
		var response = evt.response;

		console.log(request);

		if (request.path === 'image.jpg') {
		    response.headers['Content-Type'] = 'image/png';
		    response.sendFile('../img/icons/fox128x128.png');
		    return;
		}

		var paramsString = JSON.stringify(request.params, null, 2);
		var bodyString   = JSON.stringify(request.body, null, 2);

		var firstName = (request.body && request.body.first_name) || '';
		var lastName  = (request.body && request.body.last_name)  || '';

		var body = '<!DOCTYPE html><html><head><title>Firefox OS Web Server</title></head><body><h1>Hello World!</h1><h3>If you can read this, the Firefox OS Web Server is operational!</h3><p>The path you requested is: ' + request.path + '</p><h5>URL Parameters:</h5><pre>' + paramsString + '</pre><h5>POST Data:</h5><pre>' + bodyString + '</pre><h3>Sample Form</h3><form method="POST" action="."><p><label>First Name:</label><input type="text" name="first_name" value="' + firstName + '"></p><p><label>Last Name:</label><input type="text" name="last_name" value="' + lastName + '"></p><input type="submit" value="Submit"></form><p>To see something really scary, <a href="/image.jpg">click here</a> :-)</p></body></html>';

		response.send(body);
	});

	// Loading the side nav
	var e = document.getElementById('nav-slide');
	if (e != null){
		console.log('Successfully retrieved nav-slide');
		$("#nav-slide").load("../slide.html", function() {
			$('.button-collapse').sideNav({
				menuWidth: 200, // Default is 240
				edge: 'left', // Choose the horizontal origin
				closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
			});
			
			$('#home').on("click", function(ev){
				console.log("Clicked home");
				load_page("home");
			});
			$('#objects').on("click", function(ev){
				console.log("Clicked objects");
				//load_page("objects");
			});
			$('#server').on("click", function(ev){
				console.log("Clicked server");
				load_page("server");
			});
			$('#settings').on("click", function(ev){
				console.log("Clicked settings");
				load_page("settings");
			});
			$('#about').on("click", function(ev){
				console.log("Clicked about");
				load_page("about");
			});
			
			load_page("home");
			
		});
	} else {
		console.log('Error while retrieving nav-slide');
	}
	
	
	
	// We want to wait until the localisations library has loaded all the strings.
	// So we'll tell it to let us know once it's ready.
	navigator.mozL10n.once(start);

	function start() {
		// var message = document.getElementById('message');
		// message.textContent = translate('message');
		$('select').material_select();
	}

});

window.addEventListener('beforeunload', function() {
	httpServer.stop();
});


