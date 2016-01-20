window.addEventListener('DOMContentLoaded', function() {

	/*navigator.mozL10n.once(start);

	function start(){
		alert(navigator.mozL10n.language.code);
	};*/
	/*navigator.getDataStores('smsfox').then(function (stores){
		console.log(stores[0].getLength());
	});*/
	
	$("#select-language").change(function() {
		var l = $("#select-language").val();
		console.log('Selected language: ' + l);
		
		navigator.mozL10n.language.code = l;
		
	});
});