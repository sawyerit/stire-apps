const express = require("express");
const router = express.Router();
const util = require("util");

const stride = require("../client");
const logger = require("../middleware/logger").logger;
const weather = require("../helpers/weather");
const helpers = require("../helpers");

const app_name = process.env.APP_NAME || "Stride Reference App";

/**
 *  @name Bots
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/bot/ | API Reference: Bots }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *  @description
 * Bots are special integrations for apps that allow users to offer a conversational interface to the app.
 * Bots can:
 * - Be mentioned by users in conversations, whether public, private, or direct conversations.
 * - Watch for specific messages in conversations, using regular expressions, and reply, even when the bot isn’t directly mentioned.
 */

/**
 *  @name Bots: handling mentions
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/bot/ | API Reference: Installation Events }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *
 *  Anytime your bot is mentioned in a conversation
 *  Stride makes a POST to the URLs specified in the app's descriptor, including the message and its context in the request
 *
 **/
router.post("/mention", async (req, res, next) => {
	//for webhooks send the response asap or the messages will get replayed up to 3 times
	res.sendStatus(204);
	let loggerInfoName = "bot_mention";

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
					logger.error(`${loggerInfoName}  sending message found error: ${err}`);
				});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

/**
 *  @name Bots: handling direct messages
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/bot/ | API Reference: Installation Events }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *
 *  Anytime a user sends a direct message to the bot,
 *  Stride makes a POST to the URLs specified in the app's descriptor, including the message and its context in the request
 *
 **/
router.post("/directmessage", async (req, res, next) => {
	//for webhooks send the response asap or the messages will get replayed up to 3 times
	res.sendStatus(204);
	let loggerInfoName = "bot_direct_message";

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
					logger.error(`${loggerInfoName}  sending message found error: ${err}`);
				});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

/**
 *  @name Bots: listening to messages
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/bot-messages | API Reference: Bot messages }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *  @description
 * To watch specific messages, even when the bot is not directly mentioned, add one or more chat:bot:messages modules to your app descriptor.
 ```
 "chat:bot:messages": [
 {
   "key": "bot-message-weather",
"url": "/webhooks/weather"
   "pattern": ".*weather.*",
}]
 ```
 **/
router.post("/weather", async (req, res, next) => {
	//for webhooks you need to send a response asap, or Stride will try to deliver the message again (up to 3 times)
	res.sendStatus(204);
	let loggerInfoName = "bot_messages";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} message incoming for ${conversationId}: ${req.body.type}`);

		//call weather API
		const weatherResponse = await weather.weatherRequest("78701", "US").catch(err => {
			logger.error(`${loggerInfoName} found error: ${err}`);
		});

		// Call your already constructed weather card
		const message = "bot message triggered!";
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


module.exports = router;
