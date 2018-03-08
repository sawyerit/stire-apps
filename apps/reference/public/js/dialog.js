
$(document).ready(function () {

	AP.register({

		/**
		 * Anytime an actionTarget is called, your app can register to it client-site
		 * using this approach
		 * Source is the key of the component the actionTarget was triggered from
		 * Target is the actionTarget key
		 * Context is all contextual informatin about the action
		 * Parameters are all custom parameters passed to the actionTarget
		 */
		"actionTarget-sendToDialog": function ({source, target, context, parameters}) {
			$("#cloudId").val(context.cloudId);
			$("#conversationId").val(context.conversationId);
			$("#userId").val(context.userId);
			if(parameters)
				$("#parameters").val(JSON.stringify(parameters));
			if(context.message)
				$("#message").val(JSON.stringify(context.message));

		},

		/** This is how you handle dialog buttons
		 */
		"dialogAction-openSidebar": function () {
			AP.sidebar.open({key: 'sidebar-1'});
		},

		"dialogAction-disableButton": function () {
			AP.dialog.disableActions();
			setTimeout(function () {
				AP.dialog.enableActions();
			}, 1000);
		},

		"dialogAction-closeDialog": function () {
			AP.dialog.close();
		},

	});
});