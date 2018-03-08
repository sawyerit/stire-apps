const { Document } = require("adf-builder");

const app_name = process.env.APP_NAME || "Stride Reference App";

module.exports.actionCard = () => {
	let doc = new Document();

	let card = doc
		.applicationCard("Action Cards")
		.description("See the triple dot ( ellipsis) on this card for more actions.");

	//Call a service points to a target URL /action/reference-service
	card
		.action()
		.title("Call service")
		.target({ key: "actionTarget-handleCardAction" });

	card
		.action()
		.title("Open dialog")
		.target({ key: "actionTarget-sendToDialog" })
		.parameters({"custom-param-from-card": "some value"});


	//Call a service, then open a dialog
	card
			.action()
			.title("Call service then open dialog")
			.target({ key: "actionTarget-handleCardAction" })
			.parameters({ then: 'openDialog' });

	card.context(`${app_name}: Action cards example`).icon({
		url: "https://image.ibb.co/fPPAB5/Stride_White_On_Blue.png",
		label: "Stride"
	});

	return doc.toJSON();
};

module.exports.updateCard = () => {
	let doc = new Document();

	let card = doc
		.applicationCard("Incident #4253")
		.link("https://www.atlassian.com")
		.description("Something is broken");
	card
		.action()
		.title("Ack")
		.target({ key: "actionTarget-updateCard" })
		.parameters({ incidentAction: "ack" });
	card
		.action()
		.title("Resolve")
		.target({ key: "actionTarget-updateCard" })
		.parameters({ incidentAction: "resolve" });
	card.context("DevOps / Incidents").icon({
		url: "https://image.ibb.co/fPPAB5/Stride_White_On_Blue.png",
		label: "Stride"
	});

	return doc.toJSON();
};


module.exports.ackMessage = (messageToAck) => {
	messageToAck.content.unshift({"type":"paragraph","content":[{"type":"text","text":"You just triggered an action for:"}]});
}

module.exports.actionMarkMessage = () => {
	return {
		"version": 1,
		"type": "doc",
		"content": [
			{
				"type": "paragraph",
				"content": [
					{
						"type": "text",
						"text": "Click to open the app's dialog",
						"marks": [
							{
								"type": "action",
								"attrs": {
									"title": "open dialog",
									"target": {
										"key": "actionTarget-sendToDialog"
									},
									"parameters": {
										"custom-param-from-actionmark": "Some value"
									}
								}
							}
						]
					}
				]
			}
		]
	}
}