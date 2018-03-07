const { Document } = require("adf-builder");
const app_name = process.env.APP_NAME || "Stride Reference App";

/** @name Message Formatting
 @Description Using the adf-builder, create formatting accepted by the Stride editor.
 */

module.exports.differentFormatTypes = () => {
	const doc = new Document();

	doc.paragraph().em(`${app_name}: here is text formatting example`);

	doc
		.paragraph()
		.strong("bold test")
		.text(" and ")
		.em("text in italics")
		.text(" as well as ")
		.link(" a link", "https://www.atlassian.com")
		.text(" , emojis ")
		.emoji(":smile:")
		.emoji(":nerd:")
		.text(" and some code: ")
		.code("const i = 0; while(true) { i++; }");

	doc.paragraph().em("Here is a bullet list example");
	doc
		.bulletList()
		.textItem("Finish work")
		.textItem("Finish more work")
		.textItem("Relax");

	doc.paragraph().em("Here is a panel example");

	const objectTest = {
		body: { headers: { "Content-Type": "application/json" } },
		method: "GET",
		url: "/me"
	};
	doc
		.panel("info")
		.paragraph()
		.text("Here is a panel with some JSON in a code block");
	doc.codeBlock("javascript").text(JSON.stringify(objectTest));

	doc.paragraph().em("Here is a card example");

	const card = doc
		.applicationCard("An object")
		.link("https://www.atlassian.com")
		.description("With a description");
	card
		.detail()
		.title("Type")
		.text("Task")
		.icon({
			url:
				"https://ecosystem.atlassian.net/secure/viewavatar?size=xsmall&avatarId=15318&avatarType=issuetype",
			label: "Task"
		});
	card
		.detail()
		.title("User")
		.text("Joe Blog")
		.icon({
			url:
				"https://ecosystem.atlassian.net/secure/viewavatar?size=xsmall&avatarId=15318&avatarType=issuetype",
			label: "Task"
		});

	card.context("App / Context").icon({
		url: "https://image.ibb.co/fPPAB5/Stride_White_On_Blue.png",
		label: "Stride"
	});
	return doc.toJSON();
};

module.exports.eventUpdateMessage = (eventName, message) => {
	const doc = new Document();
	doc
		.paragraph()
		.strong(`${eventName}`)
		.em(`${message}`)
		.emoji(":smile:");
	return doc.toJSON();
};

module.exports.helpMenu = () => {
	const doc = new Document();
	doc.paragraph().strong(`${app_name} Help Menu`);

	var list = doc.bulletList();
	list.textItem('Send a message containing the word "weather" and i will get the weather for you.');
	list.textItem("Change the room name or topic, watch what happens.");
	list.textItem("Open the sidebar for more things you can do with the Stride API.");
	list.textItem("Click on the \"...\" menu next to any message and then \"Send to dialog\" or \"Send to service\"");

	//todo: clean this up when the action mark is supported by the adf-builder
	var openSidebar = {
		type: "paragraph",
		content: [
			{
				type: "text",
				text: "Click to open the sidebar",
				marks: [
					{
						type: "action",
						attrs: {
							title: "open sidebar",
							target: {
								key: "actionTarget-openSidebar"
							}
						}
					}
				]
			},
			{
				type: "text",
				text: " and test everything you can do with the Stride API."
			}
		]
	};
	var docJSON = doc.toJSON();
	docJSON.content[1].content[2].content[0] = openSidebar;
	//end

	return docJSON;
};

module.exports.welcomeMessage = appUserId => {
	const doc = new Document();
	doc
		.paragraph()
		.text(`I'm the ${app_name}! Thanks for installing me.  Ready to take the tour? `)
		.emoji(":smile:")
		.text(" Start by sending a message mentioning my bot (")
		.mention(`${appUserId}`)
		.text(") to see my help menu and discover all the things you can do with the Stride API ")
		.emoji(":thumbsup::skin-tone-2:");
	return doc.toJSON();
};

module.exports.userProfileFormat = (displayName, email, userId) => {
	const doc = new Document();
	doc.paragraph().strong("User Profile Information");

	doc
		.paragraph()
		.strong(`Hi ${displayName}`)
		.em(`Your email seems to be ${email} and your userId is ${userId}`);

	return doc.toJSON();
};

module.exports.userMentionFormat = user_id => {
	const doc = new Document();
	doc.paragraph().strong("Mentioning a User");

	doc
		.paragraph()
		.text("Hi ")
		.mention(`${user_id}`)
		.text(`${app_name}: You see that? I just used your user id to mention you in a conversation. `)
		.emoji(":grinning:");

	return doc.toJSON();
};

module.exports.mediaFormat = (conversationId, mediaId) => {
	const doc = new Document();

	doc
		.paragraph()
		.text(`${app_name}: I just sent you a formatted Message with Media Content! `)
		.emoji(":rofl:");

	doc.mediaGroup().media({ type: "file", id: mediaId, collection: conversationId });

	return doc.toJSON();
};
