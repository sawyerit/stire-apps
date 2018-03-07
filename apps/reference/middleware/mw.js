const jwtUtil = require("jwt-simple");
const logger = require("./logger").logger;

const loggerInfoName = "authentication";
/**
 * Get user context from a request.
 * @description
 *
 *  - CloudId is the group or organization id for the request.
 *  - ConversationId of the conversation the request came from.
 *  - resource The type of resource in context, e.g. conversation, message.
 *  - userId The id of the user who sent the message.
 *  - messageId id of the message that was sent, edited, deleted by the app.
 *
 * @name Request Context
 * @see {@link https://developer.atlassian.com/cloud/stride/security/jwt/ | Understanding JWT }
 * @return {Object} {conversationId, cloudId, resource, userId}
 * @example
 const jwtUtil = require('jwt-simple');

 //takes request object as a parameter
 const getContextInfo = function (req) {

		 // First Step: Decode the JWT token from the request using the jwtUtil lib.
		 const encodedJwt = req.headers['Authorization'].substring(7) || req.headers['authorization'].substring(7) || req.query;
		 let decodedJWT = jwtUtil.decode(encodedJwt, null, true);

		 // Second Step: set the values from the context object to vars
		 const conversationId = decodedJWT.context.resourceId;
		 const cloudId = decodedJWT.context.cloudId;
		 const resource = decodedJWT.context.resourceType;
		 const userId = decodedJWT.sub;

		 return {conversationId, cloudId, resource, userId};
 */
const getContextInfo = function(decodedJWT) {
	//todo: change to check if key exists.

	const conversationId = decodedJWT.context.resourceId;
	const cloudId = decodedJWT.context.cloudId;
	const resource = decodedJWT.context.resourceType;
	const userId = decodedJWT.sub;

	logger.info(
		`${loggerInfoName}:context conversationId: ${conversationId} cloudId: ${cloudId} resourceType ${resource} userId: ${userId}`
	);
	return { conversationId, cloudId, resource, userId };
};

const authMiddleware = secret => (req, res, next) => {
	const reqPath = req.path;

	const ignore = ignoreRoute(reqPath);

	if (ignore || req.method === "OPTIONS") {
		logger.warn(`${loggerInfoName} route ${reqPath} validation ignore`);
		next();
	} else {
		try {
			logger.info(`${loggerInfoName} validating ${reqPath}`);
			const encodedJwt =
				req.query["jwt"] ||
				req.headers["authorization"].substring(7) ||
				req.headers["Authorization"].substring(7);

			// extract jwt token from req param or from auth header.
			// Decode the base64-encoded token, which contains the context of the apiCall
			const decodedJwt = jwtUtil.decode(encodedJwt, null, true);

			// Validate the token signature using the app's OAuth secret (created in DAC App Management)
			jwtUtil.decode(encodedJwt, secret);

			// store context information in context locals context object
			let context = getContextInfo(decodedJwt);
			res.locals.context = context;
			req.locals = context;
			next();
		} catch (err) {
			if (err.message.indexOf("substring") > 0)
				res.status(400).json({ message: `JWT token not found` });
			else res.status(403).json({ message: `unable to authenticate: ${err}` });
			throw err;
		}
	}
};

// Ignores authentication for specific paths
const ignoreRoute = function(path) {
	let ignore = false;
	const listOfRoutesToIgnore = ["/installed", "/descriptor", "/public", "/favicon"];

	listOfRoutesToIgnore.forEach(function(route) {
		if (path.indexOf(route) !== -1) {
			ignore = true;
		}
	});

	return ignore;
};

module.exports = {
	authMiddleware: function(secret) {
		return authMiddleware(secret);
	}
};
