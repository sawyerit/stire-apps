
	$(document).ready(function () {

	AP.register({

		"message-action-fired": function (source, target, context, parameters) {
			console.log(
					'This dialog was opened from a message action, with the following data: '
					+ JSON.stringify(arguments));
		},

		"action-appendMessage": function (source, target, context, parameters) {
			AP.chat.setMessageBody({
						"version": 1,
						"type": "doc",
						"content": [
							{
								"type": "paragraph",
								"content": [
									{
										"type": "text",
										"text": "Just appended "
									},
									{
										"type": "text",
										"text": $("#message").val(),
										"marks": [
											{
												"type": "strong"
											}
										]
									}
								]
							}
						]
					}
			);
		},

		"dialogaction-openSidebar": function (source, target, context, parameters) {
			AP.sidebar.open({key: 'sidebar-1'});
		},

		"dialogaction-disableButton": function (source, target, context, parameters) {
			function enablePrimaryButton(enabled) {
				var dialogOptions = {
					options: {
						"primaryAction": {
							"key": "action-appendMessage",
							"name": {
								"value": "Append Message"
							},
							"enabled": enabled
						}
					}
				};
				AP.dialog.update(dialogOptions);
			}

			enablePrimaryButton(false);
			setTimeout(function () {
				enablePrimaryButton(true);
			}, 1000);
			closeDialog(false);
		},

		"dialogaction-closeDialog": function (source, target, context, parameters) {
			AP.dialog.close();
		},

	});
});