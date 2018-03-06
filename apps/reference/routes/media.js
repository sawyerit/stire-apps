const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger").logger;
const helpers = require("../helpers");
const stride = require("../client");
let https = require("https");
let rp = require("request-promise");
const util = require("util");

/**
 * @name Media File Upload
 * @description
 * Media file must be a base64 data uri string. Headers must set content-type of application/octet-stream.
 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#rest-site-cloudId-conversation-conversationId-media-post |API Reference: Media Upload }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/sending-media/ | How-to Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/document/nodes/mediaGroup/ | MediaGroup Message Node }
 *
 */
router.get("/mediaMessage", async (req, res, next) => {
	const loggerInfoName = "media_file_upload";

	try {
		const { cloudId, conversationId } = res.locals.context;

		let mediaUploadResponse = await sendMediaPromise(cloudId, conversationId).catch(err => {
			logger.error(`${loggerInfoName} media file upload found error: ${err}`);
		});

		if (mediaUploadResponse.data.id) {
			res.sendStatus(204);
		}

		logger.info(`${loggerInfoName} media upload successful ${util.format(mediaUploadResponse)}`);

		let mediaCardDoc = helpers.format.mediaFormat(conversationId, mediaUploadResponse.data.id);

		stride.api.messages
			.message_send_conversation(cloudId, conversationId, {
				body: mediaCardDoc
			})
			.then(mediaMessageResponse => {
				logger.info(
					`${loggerInfoName} media message successful ${util.format(mediaMessageResponse)}`
				);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} media file message found error: ${err}`);
				return err;
			});
	} catch (err) {
		logger.error(`${loggerInfoName} found error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

router.get("/mediaDelete", async (req, res, next) => {
	const loggerInfoName = "media_delete";

	try {
		const { cloudId, conversationId } = res.locals.context;

		let mediaUploadResponse = await sendMediaPromise(cloudId, conversationId).catch(err => {
			logger.error(`${loggerInfoName} found error: ${err}`);
		});

		logger.info(`${loggerInfoName} media upload successful ${util.format(mediaUploadResponse)}`);

		stride.api.media
			.media_delete(cloudId, conversationId, mediaUploadResponse.data.id, {})
			.then(mediaDeleteResponse => {
				logger.info(
					`${loggerInfoName} media deleted successful ${util.format(mediaDeleteResponse)}`
				);
				res.sendStatus(200);
			})
			.catch(err => {
				logger.error(`${loggerInfoName} delete media found error: ${err}`);
			});
	} catch (err) {
		logger.error(`${loggerInfoName} found error: ${err}`);
		res.sendStatus(500);
		next(err);
	}
});

function sendMediaPromise(cloudId, conversationId) {
	return new Promise((resolve, reject) => {
		const imgUrl = "https://media.giphy.com/media/L12g7V0J62bf2/giphy.gif";

		https.get(imgUrl, function(downloadStream) {
			sendMedia(cloudId, conversationId, "an_image2.jpg", downloadStream)
				.then(JSON.parse)
				.then(mediaUploadResponse => {
					return mediaUploadResponse;
				})
				.then(resolve, reject);
		});
	});
}

async function sendMedia(cloudId, conversationId, name, stream) {
	/*
			 NOTE: Upload media to Stride is the only functionality that does NOT use the client.
			 the send media async needs to be revisted and thus leaving it without
			 the use of the client api.
		*/
	let baseUrl =
		process.env.NODE_ENV === "production"
			? "https://api.atlassian.com"
			: "https://api.stg.atlassian.com";

	//todo: refactor
	const token_gen = require("../../../src/api/endpoints/authentication");
	let token = await token_gen(process.env.CLIENT_ID, process.env.CLIENT_SECRET, baseUrl);

	const options = {
		uri: `${baseUrl}/site/${cloudId}/conversation/${conversationId}/media?name=${name}`,
		method: "POST",
		headers: {
			authorization: "Bearer " + token,
			"content-type": "application/octet-stream"
		},
		body: stream
	};

	return rp(options);
}

module.exports = router;
