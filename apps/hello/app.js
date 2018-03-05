const fs = require('fs');
const express = require('express');
const app = express();
const util = require('util');
const bodyParser = require('body-parser');
const authMiddleware = require('./jwt_authentication');
require('dotenv').config('./env');

//stride document library
const {Document} = require('adf-builder');
const stride = require('./client');
let app_name = "hello bot";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(authMiddleware(process.env.CLIENT_SECRET));
app.use("/public/img", express.static("public/img"));

//Installation event for your app
app.post('/installed', async function (req, res, next) {

	const loggerInfoName = 'app_install';

	let context = {cloudId: req.body.cloudId, userId: req.body.userId, conversationId: req.body.resourceId};
	try {

		let welcomeDocument = `Hi I am the ${app_name}. Type hello. @-mention me to see my help menu.`;
		let opts = {
			body: welcomeDocument,
			headers: {
				'Content-Type': 'text/plain',
				accept: 'application/json',
			},
		};

		// Send Stride message via API
		stride.api.messages.message_send_conversation(context.cloudId, context.conversationId, opts)
			.then(response => {

				console.log(`${loggerInfoName} welcome message sent to user: ${response}`);
				res.sendStatus(200);

			}).catch((err) => {
			console.error(`unable to send welcome message ${err}`);
		});

	} catch (err) {
		console.error(`message_conversation_post error: ${err}`);
		next(err);
	}
});


app.get('/descriptor', function (req, res, next) {
	try {
		console.log('module:descriptor incoming request');

		//Read descriptor JSON file
		let buffer = fs.readFileSync('./hello-descriptor.json');

		// Converts buffer to json
		let descriptorFileJSON = JSON.parse(buffer);
		if (typeof descriptorFileJSON !== 'object') next(Error('descriptor file error: could not convert bytes to json'));

		//change baseUrl to your host
		descriptorFileJSON.baseUrl = 'https://' + req.headers.host;

		res.setHeader('Content-Type', 'application/json');
		//returns json object back to Stride server
		res.json(descriptorFileJSON);
		console.log('module:descriptor outgoing request successful');
	} catch (err) {
		console.log(`descriptor error found ${err}`);
		next(err);
	}
});


//  Sending a a message if someone types hello
app.post('/webhooks/message', async (req, res, next) => {

	//send response back asap for hello
	res.sendStatus(204);
	let loggerInfoName = 'hello_webhook_messages';

	try {

		const {cloudId, conversationId} = res.locals.context;
		console.log(`${loggerInfoName}  incoming for ${conversationId}: ${req.body.type}`);

		let helloInVariousLanguages = ["Namaste", "Bonjour", "Hola", "Guten Tag", "Konnichiwa"];
		const random_hello_message = helloInVariousLanguages[Math.floor(Math.random() * helloInVariousLanguages.length)];

		//Send a simple text message
		stride.api.messages.message_send_conversation(cloudId, conversationId, {
			body: `${random_hello_message}`,
			headers: {'Content-Type': 'text/plain', accept: 'application/json'}
		})
			.then(response => {
				console.log(`${loggerInfoName} outgoing successful for ${conversationId} response: ${util.format(response)}`);
			})
			.catch(err => {
				console.error(`${loggerInfoName} text message send found error: ${err}`);
			});


	} catch (err) {
		console.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

//sending a message if someone mentions your app
app.post('/webhooks/mention', async (req, res, next) => {

	//for hello send res asap
	res.sendStatus(204);
	let loggerInfoName = 'hello_webhook_mention';

	try {

		const {cloudId, conversationId} = res.locals.context;
		console.log(`${loggerInfoName} message incoming for ${conversationId}: ${req.body.type}`);

		//Send a help menu when bot is mentioned
		const helpMenuBody = simpleHelpMenu();
		let opts = {body: helpMenuBody};

		stride.api.messages.message_send_conversation(cloudId, conversationId, opts)
			.then(mentionResponse => {
				console.log(`${loggerInfoName} outgoing successful ${util.format(mentionResponse)}`);
			})
			.catch(err => {
				console.error(`${loggerInfoName}  sending webhook mention message found error: ${err}`);
			});


	} catch (err) {
		console.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

// Example of how to use ADF //
simpleHelpMenu = () => {
	const doc = new Document();
	doc.paragraph().strong(`${app_name} Help Menu`);
	doc
		.bulletList()
		.textItem('Say hello in a message')
		.textItem('@-mention to see this menu');
	return doc.toJSON();
};

//example of how to use a card //
helloCard = (message) => {
	const doc = new Document();
	let card = doc
		.applicationCard('Hello')
		.description(message);
	card
		.detail()
		.title('Hello in other languages');

	return doc.toJSON();
};


function envcheck() {
	if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.NODE_ENV) {
		console.error('Please set CLIENT_ID, CLIENT_SECRET and NODE_ENV as env variables in a .env or on the system.');
		process.exit(1);
	}
	if (!process.env.APP_NAME) process.env.APP_NAME = "Message App";
	if (!process.env.PORT) process.env.PORT = 8080;
}

app.listen(process.env.PORT, function () {
	envcheck();
	console.log(`Starting Server @ port ${process.env.PORT}....`);
	console.log(`Server now listening on port ${process.env.PORT} successfully!`);
});


