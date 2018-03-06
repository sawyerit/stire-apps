const express = require("express");
const router = express.Router();
const util = require("util");

const stride = require("../client");
const logger = require("../middleware/logger").logger;
const weather = require("../helpers/weather");
const helpers = require("../helpers");

const app_name = process.env.APP_NAME || "Stride Reference App";

/**
 *  @name Webhook Messages
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/webhook/ | API Reference: Installation Events }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *  @description
 *
 *  Stride can listen for messages with a distinct pattern.  Enable messages to listen for by adding the module in the descriptor and providing
 *  a pattern.
 *
 * descriptor.json setup to listen for message events
 ```
 *  //descriptor.json entry to listen to message events
 "chat:bot:messages": [
 {
   "key": "reference-weather",
"url": "/webhooks/weather"
   "pattern": ".*weather.*",
}]
 ```

 route setup
 ```
 router.post('/weather', async (req, res, next) => {

	res.sendStatus(204);
	let loggerInfoName = 'webhook_messages';


	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} message incoming for ${conversationId}: ${req.body.type}`);

		//call weather API
		const weatherResponse = await weather.weatherRequest('78701', 'US').catch(err => { logger.error(`${loggerInfoName} found error: ${err}`); });

		// Call your already constructed weather card
		const message = "webhook message triggered!";
		const messageOptsBody = weather.weatherCard(message, weatherResponse);

		let opts = {body: messageOptsBody};
		let messageWebhookResponse = await stride.api.messages.message_send_conversation(cloudId, conversationId, opts)
			.catch(err => { logger.error(`${loggerInfoName} found error: ${err}`); });

		logger.info(`${loggerInfoName} outgoing successful ${messageWebhookResponse}`);

	}
```
 **/
router.post("/weather", async (req, res, next) => {
	//for webhooks send res asap
	res.sendStatus(204);
	let loggerInfoName = "webhook_messages";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} message incoming for ${conversationId}: ${req.body.type}`);

		//call weather API
		const weatherResponse = await weather.weatherRequest("78701", "US").catch(err => {
			logger.error(`${loggerInfoName} found error: ${err}`);
		});

		// Call your already constructed weather card
		const message = "webhook message triggered!";
		const messageOptsBody = weather.weatherCard(message, weatherResponse);

		let opts = { body: messageOptsBody };
		stride.api.messages
			.message_send_conversation(cloudId, conversationId, opts)
			.then(messageWebhookResponse => {
				logger.info(`${loggerInfoName} outgoing successful ${util.format(messageWebhookResponse)}`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} sending webhook message found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

/**
 *  @name Webhooks Mentions
 *  @alias Listening to @mention
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/webhook// | Installation Events }
 *  @description
 *
 *  Stride can listen for mentions for your bot.  Enable this feature by adding the module in the descriptor.json.
 *  When the event is triggered, you can do something like send a help menu, like the example below.
 *
 * descriptor.json setup to listen for mention events
 ```
 "chat:bot": [
 {
   "key": "reference-bot",
   "mention": {
	 "url": "/webhooks/mention"
   },
   "directMessage": {
	 "url": "/webhooks/mention"
   }
 }
 ]
 ```
 **/
router.post("/mention", async (req, res, next) => {
	//for webhooks send the response asap or the messages will get replayed up to 3 times
	res.sendStatus(204);
	let loggerInfoName = "webhook_mention";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} message incoming for ${conversationId}: ${req.body.type}`);

		//Send a help menu when bot is mentioned
		const helpMenuBody = helpers.format.helpMenu();
		let opts = { body: helpMenuBody };

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, opts)
			.then(mentionResponse => {
				logger.info(`${loggerInfoName} outgoing successful ${util.format(mentionResponse)}`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName}  sending webhook mention message found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

/**
 *  @name  Webhooks Conversations
 *  @alias Listening to Conversation Events
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/webhook/ | Conversation Events }
 *  @description
 *
 * Update your descriptor to listen to conversations events like join/leave or created/updated.
 *
 * descriptor.json configuration to listen for conversation events
 *```
 * //descriptor.json entry to listen to conversation events
 chat:webhook
 {
   "key": "reference-webhook-conversation",
   "event": "conversation:updates",
   "url": "/webhooks/conversationEvents"
 }
 ```
 route setup
 ```
 router.post('/conversationEvent', async (req, res, next) => {

	res.sendStatus(204);
	let loggerInfoName = 'webhooks_conversation_update';

	try {

		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming for ${conversationId}: ${req.body.type}`);

		//Send Webhook Message
		let doc = helpers.format.eventUpdateMessage('Conversation Event Webhook', 'A conversation event occured, and I fired this message.');

		let webhookResponse = await stride.api.messages.message_send_conversation(cloudId, conversationId, {body: doc})
			.catch(err => { logger.error(`${loggerInfoName} found error: ${err}`); });
		logger.info(`${loggerInfoName} outgoing successful ${webhookResponse}`);

	}

 ```
 */
router.post("/conversationEvent", async (req, res, next) => {
	//for webhooks send res asap
	res.sendStatus(204);
	let loggerInfoName = "webhooks_conversation_update";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming for ${conversationId}: ${req.body.type}`);

		//Send Webhook Message
		let doc = helpers.format.eventUpdateMessage(
			"Conversation Event Webhooks",
			` ${app_name}: A Conversation Event occured and I sent this message.`
		);

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, { body: doc })
			.then(webhookConversationResponse => {
				logger.info(
					`${loggerInfoName} outgoing successful ${util.format(webhookConversationResponse)}`
				);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} sending webhook conversation message found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

module.exports = router;
