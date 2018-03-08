$(document).ready(function() {


	/**
	 * Listen to messages received in the room from the Javascript API
	 */
	AP.register({
		"message-received": function (message) {
			var messageReceived = "<tr><td>"+ JSON.stringify(message) + "</td><td>";
			$(messageReceived).appendTo($("#messages"));
		}
	});

	$("#openShowcase").click(function() {
		AP.action.openTarget({
			"target": {
				"key": "actionTarget-openSidebar-showcase"
			}
		});
	});

});
