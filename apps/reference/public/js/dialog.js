
$(document).ready(function () {

	AP.register({

		"actionTarget-sendToDialog": function ({source, target, context, parameters}) {
			console.log(JSON.stringify(context));
			$("#cloudId").val(context.cloudId);
			$("#conversationId").val(context.conversationId);
			$("#userId").val(context.userId);
			if(parameters)
				$("#parameters").val(JSON.stringify(parameters));
			if(context.message)
				$("#message").val(JSON.stringify(context.message));

		},

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