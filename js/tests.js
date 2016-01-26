window.addEventListener('DOMContentLoaded', function() {
	QUnit.test("Opened server", function(assert){
		assert.ok(1 == "1", "Passed!");
	});
	
	QUnit.test("Closed server", function(assert){
		assert.ok(1 == "1", "Passed!");
	});
	
	QUnit.test("...", function(assert){
		assert.ok(1 == "1", "Passed!");
	});
});