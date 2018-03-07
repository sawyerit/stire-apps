const express = require("express");
const router = express.Router();
const formatHelper = require("../helpers/format");
const stride = require("../client");
const logger = require("../middleware/logger").logger;
const util = require("util");
/**
 * @name Users: get user details
 * @description
 * Get a user's details like name, email, id, avatar url.
 */

router.get("/userDetails", async (req, res, next) => {
	const loggerInfoName = "user_details";

	try {
		const { cloudId, userId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${userId}`);

		let userDetailsResponse = await stride
			.helper(`/scim/site/${cloudId}/Users/${userId}`, "GET")
			.catch(err => `${loggerInfoName} getting user details send found error: ${err}`);

		let displayName = userDetailsResponse.displayName;
		let user_id = userDetailsResponse.id;
		let email = userDetailsResponse.emails[0]["value"];

		let atlassianDocument = formatHelper.userProfileFormat(displayName, email, user_id);

		let userResponse = await stride.api.messages
			.message_send_conversation(cloudId, conversationId, {
				body: atlassianDocument
			})
			.catch(err => {
				logger.error(`${loggerInfoName} user details message send found error: ${err}`);
			});

		logger.info(`${loggerInfoName} outgoing successful ${util.format(userResponse)}`);
		res.sendStatus(200);
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});


/**
 * @name Users: mention a user in a message
 * @description
 * To mention a user, add a `mention` node to the message. You just need to specify the user's ID and Stride
 * takes care of the rest
 */
router.get("/userMention", async (req, res, next) => {
	const loggerInfoName = "user_mention";

	try {
		const { cloudId, userId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${userId}`);

		let userDetailsResponse = await stride
			.helper(`/scim/site/${cloudId}/Users/${userId}`, "GET")
			.catch(err => `${loggerInfoName} getting user details send found error: ${err}`);

		let user_id = userDetailsResponse.id;

		let atlassianDocument = formatHelper.userMentionFormat(user_id);

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, {
				body: atlassianDocument
			})
			.then(response => {
				res.sendStatus(200);
				logger.info(`${loggerInfoName} outgoing successful ${response}`);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} user mention message send found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

module.exports = router;
