const express = require("express");
const router = express.Router();
const util = require("util");

const stride = require("../client");
const logger = require("../middleware/logger").logger;
const weather = require("../helpers/weather");
const helpers = require("../helpers");

const app_name = process.env.APP_NAME || "Stride Reference App";

/**
 *  @name  Webhooks
 *  @alias Webhooks: listening to conversation events
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/webhook/ | Webhooks }
 *  @description
 *
 * Update your descriptor to listen to conversations events like join/leave or created/updated.
 *
 * descriptor.json configuration to listen for conversation events
 *```
 * //descriptor.json entry to listen to conversation events
 chat:webhook
 {
   "key": "webhook-conversationEvents",
   "event": "conversation:updates",
   "url": "/webhooks/conversationEvents"
 }

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
