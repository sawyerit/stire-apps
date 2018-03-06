const fs = require("fs");
const helpers = require("../helpers");
const express = require("express");
const router = express.Router();
const util = require("util");
const logger = require("../middleware/logger").logger;
const stride = require("../client");

/**
 *  @name Install
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-lifecycle/ | Installation Events }
 *  @description
 *
 *  When a user installs your app, Stride calls this path configured in the lifecycle object of the descriptor.json.
 *  The server route must match the descriptor entry.
 **/
router.post("/installed", async function (req, res, next) {
	const loggerInfoName = "app_install";

	//Send 200 response to Stride immediately, letting the server know you're on it.
	let context = {
		cloudId: req.body.cloudId,
		userId: req.body.userId,
		conversationId: req.body.resourceId
	};
	try {
		//  Here is where you can store state to your db //

		//First get the app user Id using the "/me" endpoint
		const getAppUser = stride.api.users
			.me()
			.then(response => {
				logger.info(`${loggerInfoName} app user details ${util.format(response)}`);
				return response;
			}).catch(err => {
				logger.error(`${loggerInfoName} error gett app user details: ${err}`);
			});

		const appUser = await getAppUser;
		const appUserId = appUser.account_id;

		//Then send a welcome message
		let welcomeDocument = helpers.format.welcomeMessage(appUserId);

		let opts = {
			body: welcomeDocument,
			headers: {
				"Content-Type": "application/json",
				accept: "application/json"
			}
		};

		// Send Stride message via API
		stride.api.messages
			.message_send_conversation(context.cloudId, context.conversationId, opts)
			.then(response => {
				logger.info(`${loggerInfoName} welcome message sent to user: ${response}`);
				res.sendStatus(200);
			});
	} catch (err) {
		logger.error(`message_conversation_post error: ${err}`);
		next(err);
	}
});

/**
 *  @name Descriptor
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-descriptor/ | Descriptor Requests }
 *  @description
 *
 *  The descriptor file is the map for your app that Stride uses to figure out where things live, such as routes, images, etc.
 *  Stride needs to be able to retrieve this from your app server.
 **/
router.get("/descriptor", function (req, res, next) {
	try {
		logger.info("module:descriptor incoming request");

		//Read descriptor JSON file
		let buffer = fs.readFileSync("./ref-descriptor.json");

		// Converts buffer to json
		let descriptorFileJSON = JSON.parse(buffer);
		if (typeof descriptorFileJSON !== "object")
			next(Error("descriptor file error: could not convert bytes to json"));

		//change baseUrl to your host
		descriptorFileJSON.baseUrl = "https://" + req.headers.host;

		res.setHeader("Content-Type", "application/json");
		//returns json object back to Stride server
		res.json(descriptorFileJSON);
		logger.info("module:descriptor outgoing request successful");
	} catch (err) {
		logger.info(`descriptor error found ${err}`);
		next(err);
	}
});

module.exports = router;
