const express = require("express");
const router = express.Router();
const util = require("util");
const logger = require("../middleware/logger").logger;
const stride = require("../client");
let useCaseDefinition = require("../helpers/bin/useCaseBuilder");

/**
 * @name Conversation Details
 * @description
 * Get a conversation's details.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-get | Get Conversation Details}
 */
router.get("/getConversationDetails", async (req, res, next) => {
	let loggerInfoName = "conversation_details";

	try {
		const {cloudId, conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		//  App -> Conversation Detail <- StrideAPI
		stride.api.conversations
			.conversation_detail(cloudId, conversationId, {})
			.then(conversationDetailsResponse => {
				res.send(conversationDetailsResponse);
				logger.info(`${loggerInfoName} outgoing request successful ${conversationId}`);
				return conversationDetailsResponse;
			})
			.then(conversationDetailsResponse => {
				useCaseDefinition(res.locals.context, loggerInfoName, req, conversationDetailsResponse)
					.send()
					.then()
					.catch();
			})
			.catch(err => {
				logger.error(`${loggerInfoName} conversation details get found error: ${err}`);
			});

		//reference: provide more details
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Conversation Archive
 * @description
 * Archive a conversation
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-archive-put | Put Conversation Archive }
 */
router.post("/archiveConversation", async (req, res, next) => {
	let loggerInfoName = "conversation_archive";

	try {
		const {cloudId, conversationId} = res.locals.context;

		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		stride.api.conversations
			.conversation_archive(cloudId, conversationId, {body: {}})
			.then(() => {
				//archive has no content
				res.sendStatus(200);
				logger.info(`${loggerInfoName} outgoing successful.`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} archiving found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Conversation Unarchive
 * @description
 * Unarchive a conversation
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-unarchive-put | Put Conversation UnArchive }
 */
router.post("/unarchiveConversation", async (req, res, next) => {
	let loggerInfoName = "conversation_unarchive";

	try {
		const {cloudId, conversationId} = res.locals.context;

		logger.info(`${loggerInfoName}:unarchived incoming request for ${conversationId}`);

		stride.api.conversations
			.conversation_unarchive(cloudId, conversationId, {})
			.then(unarchiveResponse => {
				res.sendStatus(200);
				logger.info(`${loggerInfoName}:unarchived outgoing successful: ${unarchiveResponse}`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} unarchiving found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

module.exports = router;
