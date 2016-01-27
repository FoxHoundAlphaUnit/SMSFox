window.addEventListener('DOMContentLoaded', function() {
	QUnit.test("Opened server", function(assert){
		if (!httpServer.running){
			httpServer.start();
		}
		assert.ok(httpServer.running, "Passed!");
	});
	
	QUnit.test("Closed server", function(assert){
		if (httpServer.running){
			httpServer.stop();
		}
		assert.notOk(httpServer.running, "Passed!");
	});
	
	QUnit.test("Content well-loaded", function(assert){
		content = $("#main-container").html();
		assert.ok(content.length > 0, "Passed!");
	});
});