var httpServer = new HTTPServer(8080);

httpServer.addEventListener('request', function(evt) {
	var request  = evt.request;
	var response = evt.response;
  
	console.log(request);

	/*if (request.path === '/image.jpg') {
    response.headers['Content-Type'] = 'image/jpeg';
    response.sendFile('/img/image.jpg');
    return;
	}*/

	var paramsString = JSON.stringify(request.params, null, 2);
	var bodyString   = JSON.stringify(request.body, null, 2);

	var firstName = (request.body && request.body.first_name) || '';
	var lastName  = (request.body && request.body.last_name)  || '';

	var body = '<!DOCTYPE html><html><head><title>Firefox OS Web Server</title></head><body><h1>Hello World!</h1><h3>If you can read this, the Firefox OS Web Server is operational!</h3><p>The path you requested is: ' + request.path + '</p><h5>URL Parameters:</h5><pre>' + paramsString + '</pre><h5>POST Data:</h5><pre>' + bodyString + '</pre><h3>Sample Form</h3><form method="POST" action="."><p><label>First Name:</label><input type="text" name="first_name" value="' + firstName + '"></p><p><label>Last Name:</label><input type="text" name="last_name" value="' + lastName + '"></p><input type="submit" value="Submit"></form><p>To see something really scary, <a href="/image.jpg">click here</a> :-)</p></body></html>';
	
	response.send(body);
});

window.addEventListener('load', function() {
	var status = document.getElementById('server-status');
	var ip     = document.getElementById('ip-address');
	var port   = document.getElementById('listening-port');
	var start  = document.getElementById('start-server');
	var stop   = document.getElementById('stop-server');

	IPUtils.getAddresses(function(ipAddress) {
		ip.textContent = ip.textContent || ipAddress;
	});

	port.textContent = httpServer.port;
	navigator.mozL10n.once(moz_start);
	
	function moz_start(){
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
	}

});

window.addEventListener('beforeunload', function() {
	httpServer.stop();
});
