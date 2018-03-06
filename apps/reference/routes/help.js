const express = require("express");
const router = express.Router();

const logger = require("../middleware/logger").logger;
const stride = require("../client");
let helpers = require("../helpers");
const util = require("util");
const app_name = process.env.APP_NAME || "Stride Reference App";

router.get("/menu", async (req, res, next) => {
	const loggerInfoName = "message_help_menu";

	try {
		const { cloudId, conversationId } = res.locals.context;

		logger.info(`${loggerInfoName} incoming call for ${conversationId}`);

		//Then send a message with the help menu
		const helpMenuBody = helpers.format.helpMenu();
		let opts = { body: helpMenuBody };

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, opts)
			.then(response => {
				res.sendStatus(200);
				logger.info(
					`${loggerInfoName} outgoing successful for conversation ${util.format(response)}`
				);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} sending help menu found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

module.exports = router;
