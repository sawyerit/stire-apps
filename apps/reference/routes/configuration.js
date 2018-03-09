const util = require("util");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const logger = require("../middleware/logger").logger;
const stride = require("../client");

// In memory storage
let configStore = {};

/**
 * @name Configuration pages
 * @description
 * You can add a configuration page for users to configure your app in the conversation it’s installed within.
 * For example, for a to-do app, your app configuration can let users link a to-do list to the conversation, and select which notifications should be sent to the conversation
 * Configuration pages are declared in the app descriptor as chat:configuration.
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/config-pages/  | Config Guide}
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-config-pages/ | How-to Guide }
 */

/**
 * @name Configuration page: UI
 * @description
 * This configuration UI will be loaded in an iframe in a dialog
 */

router.get("/config", (req, res, next) => {
	let loggerInfoName = "config_state_template_fetch";

	try {
		res.redirect("/public/templates/configuration.html");
		logger.info(`${loggerInfoName} redirect successful`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		next(err);
	}
});


/**
 * @name Configuration pages: configuration state
 * @description
 * The app's configuration state for a conversation (configured: true/false)
 * If the configuration state is "false", then users will be prompted to configure the app before they can use it
 */

router.get("/config/state", cors(), async (req, res, next) => {
	let loggerInfoName = "config_state_get";

	try {
		const { conversationId } = res.locals.context;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		const config = configStore[conversationId];
		const state = { configured: true };
		if (!config) state.configured = false;

		res.send(JSON.stringify(state));
		logger.info(`${loggerInfoName} returned configuration content for ${conversationId}`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

/**
 * @name Configuration pages: Get/set configuration data
 * @description
 * Configuration data is saved in your app's backend
 */
router.get("/config/content", (req, res, next) => {
	let loggerInfoName = "config_content_get";

	try {
		const conversationId = res.locals.context.conversationId;
		logger.info(`${loggerInfoName} incoming request for ${conversationId}`);

		let config = configStore[conversationId] || { notificationLevel: "NONE" };

		res.send(JSON.stringify(config));
		logger.info(`${loggerInfoName} outgoing successful for ${conversationId}`);
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

router.post("/config/content", async (req, res, next) => {
	let loggerInfoName = "config_content_and_state_update";

	try {
		const { cloudId, conversationId } = res.locals.context;
		configStore[conversationId] = req.body;

		let opts = {};
		opts.body = { context: { cloudId, conversationId }, configured: true };

		//Call config update post endpoint
		stride.api.config.config_update_post("configuration-1", opts).then(() => {
			res.sendStatus(204);
			logger.info(`${loggerInfoName} configuration state update successful.`);
		});
	} catch (err) {
		logger.error(`${loggerInfoName} error found: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

module.exports = router;
