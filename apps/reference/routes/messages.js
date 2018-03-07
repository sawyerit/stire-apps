const express = require("express");
const router = express.Router();

const logger = require("../middleware/logger").logger;
const stride = require("../client");
let helpers = require("../helpers");
const util = require("util");
const app_name = process.env.APP_NAME || "Stride Reference App";

/**
 * @name Messages: send a direct message to a user
 * @description
 * Since sending a message is done using a conversation ID, the the first step is to obtain the conversation ID for the direct conversation.
 * You can then use the "send a message to a conversation" endpoint
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#rest-site-cloudId-conversation-user-userId-message-post | API Reference: Direct Messages }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/messages/ | Concept Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/sending-direct-messages-to-users/| How-to Guide }
 */
router.post("/direct", async (req, res, next) => {
	const loggerInfoName = "message_send_direct";

	try {
		const { cloudId, userId } = res.locals.context;

		logger.info(`${loggerInfoName}:direct incoming request for user ${userId}`);

		//Direct Message Setup
		const message = `${app_name}: I just sent you a direct message.`;

		let optsDoc = {
			body: message,
			headers: { "Content-Type": "text/plain", accept: "application/json" }
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
 * @name Messages: send a text message
 * @description
 * Send a plain text message.  Headers.Content-Type must be set to text/plain.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#rest-site-cloudId-conversation-user-userId-message-post | API Reference: Messages }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/messages/ | Concept Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/sending-messages/#send-plain-text | How-to Guide }
 */
router.post("/textFormat", async (req, res, next) => {
	let loggerInfoName = "message_text_conversation";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		// Create and Send Text Message
		let textMessageOpts = {
			body: `${app_name}: I just send you a plain text message.  Remember, Content-Type must be set to text/plain.`,
			headers: { "Content-Type": "text/plain", accept: "application/json" }
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

/**
 * @name Messages: send a message with rich format
 * @description
 * Send a message in Rich Text Format.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#rest-site-cloudId-conversation-user-userId-message-post | API Reference: Messages }
 * @see {@link   https://developer.atlassian.com/cloud/stride/learning/messages/ | Concept Guide }
 * @see {@link   https://developer.atlassian.com/cloud/stride/learning/formatting-messages/ | How-to Guide }
 * @see {@link   https://developer.atlassian.com/cloud/stride/blocks/message-format/ | Building Block }
 */
router.get("/richFormatMessage", async (req, res, next) => {
	const loggerInfoName = "format_message_variety";

	try {
		const { cloudId, conversationId } = res.locals.context;
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
 * @name Messages: update a message
 * @description
 * Update a message.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-messageId-put | API Reference: Update Conversation Message }
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-messageId-put  | API Reference: Update Direct Message }
 * @see {@link   https://developer.atlassian.com/cloud/stride/learning/messages/ | Concept Guide }
 */
router.post("/edit", async (req, res, next) => {
	let loggerInfoName = "message_update_conversation";

	try {
		const { cloudId, conversationId } = res.locals.context;
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
 * @name Messages: delete a message
 * @description
 * Delete an existing message.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-messageId-delete | API Reference: Delete Conversation Message }
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-messageId-delete | API Reference: Delete Direct Message }
 * @see {@link   https://developer.atlassian.com/cloud/stride/learning/messages/ | Concept Guide }
 */
router.post("/delete", async (req, res, next) => {
	let loggerInfoName = "message_delete_in_conversation";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		// Create and Send Text Message
		let textMessageOpts = {
			body: `${app_name}: This message is about to be delete, watch out!`,
			headers: { "Content-Type": "text/plain" }
		};

		const messageToBeDeletedSend = stride.api.messages
			.message_send_conversation(cloudId, conversationId, textMessageOpts)
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
