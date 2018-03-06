const util = require("util");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const logger = require("../middleware/logger").logger;
const stride = require("../client");

// In memory storage
let configStore = {};

router.get("/config", (req, res, next) => {
	let loggerInfoName = "config_state_template_fetch";

	try {
		res.redirect("/public/templates/app-module-config.html");
		logger.info(`${loggerInfoName} redirect successful`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});

router.get("/config/state", cors(), async (req, res, next) => {
	let loggerInfoName = "config_state";

	try {
		const {conversationId} = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		const config = configStore[conversationId];
		const state = {configured: true};
		if (!config) state.configured = false;

		res.send(JSON.stringify(state));
		logger.info(`${loggerInfoName} outgoing successful for ${conversationId}`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Config Data Fetch
 * @description
 * Fetching the configuration data for a conversation.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-app-module-chat-conversation-chat-configuration-key-state-get  |Config Store API }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/config-pages/  | Config Guide}
 */
router.get("/config/content", (req, res, next) => {
	let loggerInfoName = "config_state_get";

	try {
		const conversationId = res.locals.context.conversationId;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		let config = configStore[conversationId] || {notificationLevel: "NONE"};

		res.send(JSON.stringify(config));
		logger.info(`${loggerInfoName} outgoing successful for ${conversationId}`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Config Data Storage
 * @description
 * Storing the configuration data for a conversation.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-app-module-chat-conversation-chat-configuration-key-state-post  |Store Config }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/config-pages/  | Config Guide}
 */
router.post("/config/content", async (req, res, next) => {
	let loggerInfoName = "config_state_post";

	try {
		const {cloudId, conversationId} = res.locals.context;
		configStore[conversationId] = req.body;

		let opts = {};
		opts.body = {context: {cloudId, conversationId}, configured: true};

		//Call config update post endpoint
		stride.api.config
			.config_update_post("reference-config", opts)
			.then(() => {
				res.sendStatus(204);
				logger.info(`${loggerInfoName} outgoing successful.`);
			});

	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

module.exports = router;
