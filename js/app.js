/* Global variables */
var last_sms_id = -1;
var httpServer = new HTTPServer(8080);

/* Logging the result from messages */
function logMsg(msg){
	var r = "";
	['type', 'id', 'threadId', 'body', 'delivery', 'deliveryStatus', 'read', 'receiver', 'sender', 'timestamp', 'messageClass'].forEach(function (key){
		r += '<br> ' + key + ': ' + msg[key];
	});
	console.log(r);
}

/* TODO: May have a deprecated call */
function update_loc(){
	$('[data-l10n-id]').each(function(index){
		$(this).html(navigator.mozL10n.get($(this).attr('data-l10n-id')));
	});
}

/* Functions to stop and start the server from the app */
function fox_server_stop(httpServer, sstatus){
	console.log('Clicked on stop');
  	httpServer.stop();
	sstatus.textContent = navigator.mozL10n.get('stopped');
}
function fox_server_start(httpServer, sstatus){
	console.log('Clicked on start');
  	httpServer.start();
	sstatus.textContent = navigator.mozL10n.get('running');
}

/* Function to send a SMS through the app (with the response being displayed on the app)*/
function fox_send_sms(msg, phone){
	console.log('Submitting SMS form...');
	console.log('Submitted message : ' + msg + ' Phone nb: ' + phone);

	/* Creating the response div, if not existing */
	var resp = document.getElementById('response');
	if (resp == null) {
		$("#main-container").append('<div class="row"><div id="response"></div></div>');
	}

	$("#response").html(navigator.mozL10n.get('submitting_sms') + '...');

	var request;
	request = navigator.mozMobileMessage.send(phone, msg);

	/* When the message was successfully sent */
	request.onsuccess = function (){
		window.thing = this;
		console.log(this.result);
		console.log('Sent to: ' + this.result);
		last_sms_id = this.result['id'];
		logMsg(this.result);
		$("#response").html('<span>' + navigator.mozL10n.get('successfully_sent') + ' ✓</span><br/>');

		/* Check if the last sms was well delivered (receipt) */
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

	/* When the message wasn't sent correctly */
	request.onerror = function (){
		window.thing = this;
		console.error(this.error.name);
		console.error(this.error.message);
		$("#response").html('<span>' + navigator.mozL10n.get('error_sending_message') + ' ✗</span>');
		$("#response").append('<span>' + this.error.name + ':' + this.error.message + '</span>');
	};
}

/* Retrieving phone contacts into the element with the id_elem given */
function fox_retrieve_contacts(id_elem){
	var allContacts = navigator.mozContacts.getAll();

	allContacts.onsuccess = function(event) {
		var cursor = event.target;
		var gn, fn, tl;
		if (cursor.result) {
			gn = (cursor.result.givenName == null) ? "" : cursor.result.givenName[0]
			fn = (cursor.result.familyName == null) ? "" : cursor.result.familyName[0]
			tl = (cursor.result.tel == null) ? "" : cursor.result.tel[0].value
			console.log('Found one contact... Given name : ' + gn + ', Family name : ' + fn + ', Tel : ' + tl);

			/* Append new contact to the select */
			$('#'+id_elem).append('<option value="' + tl + '">' + gn + ' ' + fn + '</option>');

			/* Go to the next contact */
			cursor.continue();
		} else {
			console.log('No more contacts, creating the Materialize select...');
			/* Once the contacts are all retrieved, we create the Materialize select */
			$('select').material_select();
		}
	};

	allContacts.onerror = function() {
		console.warn('Something went terribly wrong while retrieving the contacts!');
	};
}

/* Loading the page */
function load_page(requested_page){
	console.log('Loading page ' + requested_page);
	
	$("#main-container").load("../content/" + requested_page + "_content.html", function(){
		console.log('Loading HTML performed!');
		update_loc();
		
		if (requested_page == "server"){
			/* Getting the elements */
			var sstatus = document.getElementById('server-status');
			var ip     = document.getElementById('ip-address');
			var port   = document.getElementById('listening-port');
			var start_b  = document.getElementById('start-server');
			var stop_b   = document.getElementById('stop-server');

			/* Displaying */
			IPUtils.getAddresses(function(ipAddress) {
				ip.textContent = ip.textContent || ipAddress;
			});
		
			port.textContent = httpServer.port;
		
			if (httpServer.running){
				sstatus.textContent = navigator.mozL10n.get('running');
			} else {
				sstatus.textContent = navigator.mozL10n.get('stopped');
			}

			/* Adding listeners in the buttons */
			start_b.addEventListener('click', function() {
				fox_server_start(httpServer, sstatus);
			});

			stop_b.addEventListener('click', function() {
				fox_server_stop(httpServer, sstatus);
			});
		
			$('#testing-server').on('click', function(e){
				console.log('Clicked on testing');
			
				e.preventDefault();
				var activity = new MozActivity({
					name: "view",
					data: {
						type: "url",
						url: 'http://' + ip.textContent + ':' + port.textContent
					}
				});
			});
		} else if (requested_page == "settings"){	
			/* Initializing the selects */
			$('select').material_select();
		
			/* Modifying the app language */
			$("#select-language").change(function() {
				var l = $("#select-language").val();
				console.log('New selected language: ' + l);
				navigator.mozL10n.language.code = l;
			});
		} else if (requested_page == "index"){
			last_sms_id = -1;

			/* Settings the behavior on click : sending SMS */
			$('#sms-submit').on("click", function (ev){
				var msg = document.getElementById('message').value;
				var phone = document.getElementById('contacts').value;
				fox_send_sms(msg, phone);
			});

			fox_retrieve_contacts('contacts');
		} else if (requested_page == "about"){
			$('#link-github').on('click', function(e){
				console.log('Clicked on the GitHub link');
			
				e.preventDefault();
				var activity = new MozActivity({
					name: "view",
					data: {
						type: "url",
						url: 'https://github.com/FoxHoundAlphaUnit/SMSFox'
					}
				});
			});
		}
	});
}

/* DOMContentLoaded is fired once the document has been loaded and parsed,
but without waiting for other external resources to load (css/images/etc)
That makes the app more responsive and perceived as faster.
https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded */
window.addEventListener('DOMContentLoaded', function() {

	/* We'll ask the browser to use strict code to help us catch errors earlier.
	https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode */
	'use strict';
	
	/* Adding listener to the server (when the server is getting a request) */
	httpServer.addEventListener('request', function(evt) {
		var request  = evt.request;
		var response = evt.response;

		console.log(request);

		var main_content = '<!DOCTYPE html><html><head><title>SMSFox Server</title></head><body><a href="send/">Sending SMS</a><a href="">Start server</a><a href="">Stop server</a></body></html>';
		
		if (request.path === '/image.jpg') {
		    response.headers['Content-Type'] = 'image/png';
		    response.sendFile('../img/icons/fox128x128.png');
		    return;
		} else if (request.path === '/send/') {
			var send_content = '<!DOCTYPE html><html><head><title>SMSFox Server</title></head><body><h1>Send a message through your phone</h1><form method="POST" action="."><p><label>Phone number:</label><input type="number" name="phone" value=""></p><p><label>Message:</label><input type="text" name="msg" value=""></p><input type="submit" value="Submit"></form></body></html>';

			var phone = (request.body && request.body.phone) || '';
			var msg  = (request.body && request.body.msg)  || '';
			
			if (phone != '' && msg != ''){
				fox_send_sms(msg.replace(/\+/g,' '), phone.replace(/\+/g,' '));
				// later, we may need to return another response here so the user know it has been sent by the app
			}
			
			response.send(send_content);
			return;
		} else {
			var paramsString = JSON.stringify(request.params, null, 2);
			var bodyString   = JSON.stringify(request.body, null, 2);

			var firstName = (request.body && request.body.first_name) || '';
			var lastName  = (request.body && request.body.last_name)  || '';
			
			var hello_world_content = '<!DOCTYPE html><html><head><title>Firefox OS Web Server</title></head><body><h1>Hello World!</h1><h3>If you can read this, the Firefox OS Web Server is operational!</h3><p>The path you requested is: ' + request.path + '</p><h5>URL Parameters:</h5><pre>' + paramsString + '</pre><h5>POST Data:</h5><pre>' + bodyString + '</pre><h3>Sample Form</h3><form method="POST" action="."><p><label>First Name:</label><input type="text" name="first_name" value="' + firstName + '"></p><p><label>Last Name:</label><input type="text" name="last_name" value="' + lastName + '"></p><input type="submit" value="Submit"></form></body></html>';

			response.send(hello_world_content);
			return;
		}
	});

	/* Loading the side nav */
	var e = document.getElementById('nav-slide');
	if (e != null){
		console.log('Successfully retrieved nav-slide');
		$("#nav-slide").load('../slide.html', function() {
			$('.button-collapse').sideNav({
				menuWidth: 200, /* Default is 240 */
				edge: 'left', /* Choose the horizontal origin */
				closeOnClick: true /* Closes side-nav on <a> clicks, useful for Angular/Meteor */
			});
			
			$('#home').on("click", function(ev){
				console.log("Clicked home");
				load_page("index");
			});
			$('#objects').on("click", function(ev){
				console.log("Clicked objects");
				Materialize.toast('Work in progress', 4000);
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
			
			load_page("index");
			
		});
	} else {
		console.log('Error while retrieving nav-slide');
	}
	
	/* We want to wait until the localisations library has loaded all the strings.
	So we'll tell it to let us know once it's ready. */
	navigator.mozL10n.once(start);

	function start() {
		// var message = document.getElementById('message');
		// message.textContent = translate('message');
		$('select').material_select();
	}

});

/* Stopping the server when unload */
window.addEventListener('beforeunload', function() {
	httpServer.stop();
});

