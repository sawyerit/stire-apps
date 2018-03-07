$(document).ready(function() {
	function init(event) {
		$("#" + event.target.id).prop("disabled", true);
		$("#info").text("API responses will be shown here");
	}

	function success(event, data) {
		$("#" + event.target.id).prop("disabled", false);
		if (data) $("#info").text(JSON.stringify(data));
	}

	function error(event, data) {
		$("#" + event.target.id).prop("disabled", false);
		if (data) $("#info").text(JSON.stringify(data));
	}

	/** <----- Client-side Javascript API ------ > */

	$("#openDialog").click(function() {
		AP.action.openTarget({
			"target": {
				"key": "actionTarget-sendToDialog"
			},
			"parameters": {
				"custom-parameter": "custom parameter value"
			}
		});
	});

	$("#openConfig").click(function() {
		AP.dialog.open({ key: "dialog-configuration" });
	});

	$("#setMessageBody").click(function() {
		AP.chat.setMessageBody({
					"version": 1,
					"type": "doc",
					"content": [
						{
							"type": "paragraph",
							"content": [
								{
									"type": "text",
									"text": "I've just set the message body"
								}
							]
						}
					]
				}
		);
	});

	/** <----- Messages ------ > */

	$("#textFormatMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/messages/textFormat",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#richFormatMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/messages/richFormatMessage",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#mediaMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/media/mediaMessage",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#directMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/messages/direct",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#editMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/messages/edit",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#deleteMessage").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/messages/delete",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	/** <----- Users ------ > */

	$("#userDetails").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/users/userDetails",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#userMention").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/users/userMention",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	/** <-----  Actions ------ > */

	$("#actionCard").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/actions/actionCard",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#updateCard").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/actions/updateCard",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	/** <----- Conversations ------ > */

	$("#getConversationDetails").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/conversations/getConversationDetails",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#archiveConversation").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/conversations/archiveConversation",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	$("#unarchiveConversation").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/conversations/unarchiveConversation",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	/** <-------------------- help -------------------> */

	$("#helpMenu").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "GET",
				url: "/help/menu",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});

	/**   <------------------ Custom ------------> */

	$("#pingApp").click(function(event) {
		init(event);
		AP.auth.withToken(function(err, token) {
			$.ajax({
				type: "POST",
				url: "/custom/ping",
				headers: { Authorization: "Bearer " + token },
				dataType: "json",
				success: function(data) {
					success(event, data);
				},
				error: function(data) {
					error(event, data);
				}
			});
		});
	});
});
