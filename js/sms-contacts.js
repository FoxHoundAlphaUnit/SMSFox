window.addEventListener('DOMContentLoaded', function() {
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