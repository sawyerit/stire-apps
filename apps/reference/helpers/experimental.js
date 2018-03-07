const { Document } = require("adf-builder");

const app_name = process.env.APP_NAME || "Stride Reference App";

module.exports.messageWithInlineActions = () => {
	return {
		"version": 1,
		"type": "doc",
		"content": [
			{
				"type": "paragraph",
				"content": [
					{
						"type": "text",
						"text": "Do you approve?"
					}
				]
			},
			{
				"type": "bodiedExtension",
				"attrs": {
					"extensionType": "com.atlassian.stride",
					"extensionKey": "actionGroup"
				},
				"content": [
					{
						"type": "paragraph",
						"content": [
							{
								"type": "inlineExtension",
								"attrs": {
									"extensionType": "com.atlassian.stride",
									"extensionKey": "action",
									"parameters": {
										"title": "Approve",
										"appearance":"default",
										"action": {
											"target": {
												"key": "actionTarget-handleInlineMessageAction"
											},
											"parameters": {
												"reason": "approve"
											}
										}
									}
								}
							},
							{
								"type": "inlineExtension",
								"attrs": {
									"extensionType": "com.atlassian.stride",
									"extensionKey": "action",
									"parameters": {
										"title": "Reject",
										"appearance":"default",
										"action": {
											"target": {
												"key": "actionTarget-handleInlineMessageAction"
											},
											"parameters": {
												"reason": "reject"
											}
										}
									}
								}
							}
						]
					}
				]
			}
		]
	}
};

module.exports.inlineActionResponseMessage = (userId, reason) => {
	let approvalTxt =
			reason === "approve" ?
					"Approved by ": "Rejected by ";

	return {
		"version": 1,
		"type": "doc",
		"content": [
			{
				"type": "paragraph",
				"content": [
					{
						"type": "text",
						"text": "Do you approve?"
					}
				]
			},
			{
				"type": "paragraph",
				"content": [
					{
						"type": "text",
						"text": approvalTxt,
						"marks": [
							{
								"type": "strong"
							}
						]
					},
					{
						"type": "mention",
						"attrs": {
							"id": userId
						}
					}
				]
			}
		]
	}
}
