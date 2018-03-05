const jwtUtil = require('jwt-simple');

// < ------------ authentication and context related ------------->

authMiddleware = secret => (req, res, next) => {
	const reqPath = req.path;
	const loggerInfoName = 'authentication';

	const ignore = ignoreRoute(reqPath);

	if (ignore || req.method === 'OPTIONS') {
		console.warn(`${loggerInfoName} route ${reqPath} validation ignore`);
		next();
	} else {
		try {
			console.log(`${loggerInfoName} validating ${reqPath}`);
			const encodedJwt =
				req.query['jwt'] || req.headers['authorization'].substring(7) || req.headers['Authorization'].substring(7);

			// extract jwt token from req param or from auth header.
			// Decode the base64-encoded token, which contains the context of the apiCall
			const decodedJWT = jwtUtil.decode(encodedJwt, null, true);

			// Validate the token signature using the app's OAuth secret (created in DAC App Management)
			jwtUtil.decode(encodedJwt, secret);

			//todo: change to check if key exists.
			const conversationId = decodedJWT.context.resourceId;
			const cloudId = decodedJWT.context.cloudId;
			const resource = decodedJWT.context.resourceType;
			const userId = decodedJWT.sub;

			// store context information in context locals context object
			res.locals.context = {conversationId, cloudId, resource, userId};
			next();
		} catch (err) {

			if (err.message.indexOf('substring') > 0) {
				console.error(`unable to authenticate: ${err}`);
				res.status(400).json({message: `JWT token not found`});
				throw err;

			} else {
				console.error(`unable to authenticate: ${err}`);
				res.status(403).json({message: `unable to authenticate: ${err}`});
				throw err;
			}

		}
	}
};

// Ignores authentication for specific paths
const ignoreRoute = function (path) {
	let ignore = false;
	const listOfRoutesToIgnore = ['/installed', '/descriptor', '/public'];
	listOfRoutesToIgnore.forEach(function (route) {
		if (path.indexOf(route) !== -1) {
			ignore = true;
		}
	});

	return ignore;
};


module.exports = authMiddleware;