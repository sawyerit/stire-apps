const express = require("express");
const router = express.Router();

const logger = require("../middleware/logger").logger;
const stride = require("../client");
let helpers = require("../helpers");
const util = require("util");
const app_name = process.env.APP_NAME || "Stride Reference App";

/**
 * @name Message Direct
 * @description
 * Send a direct message to a user.
 * @see {@link   https://developer.atlassian.com/cloud/stride/learning/messages/ | Messages Guide }
 */
router.post("/direct", async (req, res, next) => {
	const loggerInfoName = "message_send_direct";

	try {
		const {cloudId, userId} = res.locals.context;

		logger.info(`${loggerInfoName}:direct incoming request for user ${userId}`);

		//Direct Message Setup
		const message = `${app_name}: I just sent you a direct message.`;

		let optsDoc = {
			body: message,
			headers: {"Content-Type": "text/plain", accept: "application/json"}
		};

		stride.api.messages
			.message_send_direct(cloudId, userId, optsDoc)
			.then(response => {
				res.sendStatus(204);
				logger.info(
					`${loggerInfoName}:direct outgoing successful for user ${userId}, response: ${response}`
				);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} direct message send found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Message Text
 * @description
 * Send a plain text message.  Headers.content-type must be set to text/plain.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-post | Send Conversation Message }
 *
 */
router.post("/textFormat", async (req, res, next) => {
	let loggerInfoName = "message_text_conversation";

	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		// Create and Send Text Message
		let textMessageOpts = {
			body: `${app_name}: I just send you a plain text message.  Remember, Content-Type must be set to text/plain.`,
			headers: {"Content-Type": "text/plain", accept: "application/json"}
		};

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, textMessageOpts)
			.then(response => {
				res.sendStatus(204);
				logger.info(
					`${loggerInfoName} outgoing successful for ${conversationId} response: ${response}`
				);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} text message send found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

//doc string not required for this route.
router.get("/richFormatMessage", async (req, res, next) => {
	const loggerInfoName = "format_message_variety";

	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		const variousFormatAtlassianDoc = helpers.format.differentFormatTypes();

		//Format Message
		stride.api.messages
			.message_send_conversation(cloudId, conversationId, {
				body: variousFormatAtlassianDoc
			})
			.then(messageFormatResponse => {
				res.sendStatus(204);
				logger.info(`${loggerInfoName} outgoing successful ${util.format(messageFormatResponse)}`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} sending various format message found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		next(err);
	}
});


/**
 * @name Message Update
 * @description
 * Update a conversation message
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-messageId-edit | Edit Conversation Message }
 *
 */
router.post("/edit", async (req, res, next) => {
	let loggerInfoName = "message_update_conversation";

	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		//Send Message
		let messageInAtlassianFormat = helpers.adf.text2Atlassian(
			`${app_name}: How do you spell tomfoulery?`
		);

		//get msResponse first
		let msgResponse = await stride.api.messages
			.message_send_conversation(cloudId, conversationId, {
				body: messageInAtlassianFormat
			})
			.catch(err => {
				logger.error(`${loggerInfoName} send message for updating found error: ${err}`);
			});

		//get the id of the message from response
		const messageId = msgResponse.id;

		let editedMessageInAtlassianFormat = helpers.adf.text2Atlassian(
			`${app_name}: It is spelled tomfoolery! I edited this message.`
		);

		//using the id of the message, edit your message
		stride.api.messages
			.message_update_conversation(cloudId, conversationId, messageId, {
				body: editedMessageInAtlassianFormat
			})
			.then(updateResponse => {
				logger.info(
					`${loggerInfoName} outgoing successful for ${conversationId} response: ${util.format(
						updateResponse
					)}`
				);
				res.sendStatus(204);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} update message send found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Message Delete
 * @description
 * Delete an existing message.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-messageId-delete | Delete Message }
 *
 */
router.post("/delete", async (req, res, next) => {
	let loggerInfoName = "message_delete_in_conversation";

	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		// Create and Send Text Message
		let textMessageOpts = {
			body: `${app_name}: This message is about to be delete, watch out!`,
			headers: {"Content-Type": "text/plain"}
		};

		const messageToBeDeletedSend = stride.api.messages.message_send_conversation(cloudId, conversationId, textMessageOpts)
			.then(response => {
				return response;
			})
			.catch(err => {
				logger.error(`${loggerInfoName} send message for deletion found error: ${err}`);
			});


		const txtMsgResponse = await messageToBeDeletedSend;

		logger.info(`${loggerInfoName} outgoing successful ${txtMsgResponse}`);

		let txtMsgResponseObj = JSON.parse(txtMsgResponse);
		let messageId = txtMsgResponseObj.id;


		stride.api.messages
			.message_delete_conversation(cloudId, conversationId, messageId, {})
			.then(deleteResponse => {
				logger.info(`${loggerInfoName} outgoing successful`);
				res.sendStatus(204);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} message deletion found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});


module.exports = router;
