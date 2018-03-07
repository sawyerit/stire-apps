const fs = require("fs");
const helpers = require("../helpers");
const express = require("express");
const router = express.Router();
const util = require("util");
const logger = require("../middleware/logger").logger;
const stride = require("../client");

/**
 * /**
 * @name Custom: securing calls between the app's frontend and backend
 * @description
 * Making an AJAX call from the app front-ent (sidebar, dialog, configuration dialog) to the app back-end in a secured way,
 * using JWT tokens generated via the Stride Javascript API
 * You can find the context for the request (cloudId, conversationId) in the JWT token
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/jsapi/auth/withToken/ | API Reference: Authentication With Token }
 * @see {@link https://developer.atlassian.com/cloud/stride/security/jwt/ | Security: Understanding JWT }
 */

router.post("/ping", async (req, res, next) => {
	let loggerInfoName = "custom_ping";

	try {
		const { cloudId, conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		// Create and Send Text Message
		let textMessageOpts = {
			body: `Pong`,
			headers: { "Content-Type": "text/plain", accept: "application/json" }
		};

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, textMessageOpts)
			.then(response => {
				res.send(JSON.stringify({ status: "OK" }));
				logger.info(`${loggerInfoName}: sent a response back`);
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

module.exports = router;
