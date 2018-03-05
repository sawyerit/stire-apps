const generateToken = require('./endpoints/authentication');

function getBaseUrl() {
	const currEnv = process.env.NODE_ENV;
	if (currEnv !== 'production') {
		return 'https://api.stg.atlassian.com';
	} else {
		return 'https://api.atlassian.com';
	}
}

/**
 * @ignore
 * @name Request
 * @description Responsible for binding and building a stride request.
 * @param auth clientId and secret passed from client
 * @param method Request method  GET | POST | PUT | DEL
 * @param endpoint Stride API URL to call
 * @param opts
 * <ol>
 *     <li>opts.body </li>
 *     <li>opts.headers To override defaults application/json, or to add additional headers. </li>
 *     <li> opts.qs to include any query string paramaters in the request. </li>
 *     </ol>
 * @return {object}

 * */
module.exports = apiRequest = async function buildRequest(auth, method, endpoint, opts) {
	let baseUrl = getBaseUrl();
	const {clientId, secret} = auth;

	try {
		const token = await generateToken(clientId, secret, baseUrl);
		const req = {
			uri: `${baseUrl}${endpoint}`,
			method,
			headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', accept: 'application/json'},
			json: true,
		};


		//Handle DELETE method case
		if (req.method === 'DELETE') {
			delete req['body'];
		}

		// Handle POST use case
		if (req.method === 'POST' || req.method === 'PUT') {

			// A Post and PUT changes state.
			if (opts.headers) req.headers = Object.assign({}, req.headers, opts.headers);
			if (opts.body) req.body = opts.body;

			//todo: talk to Vadym about this.
			if (req.headers['Content-Type'] === 'text/plain') {
				delete req['json'];
			}

		}

		// Handle GET use case
		if (req.method === 'GET') {

			if (opts.headers) req.headers = Object.assign({}, req.headers, opts.headers);
			delete req['body'];
			delete req['Content-Type'];
		}


		if (req.method === 'OPTIONS') {
			if (opts.headers) req.headers = Object.assign({}, req.headers, opts.headers);
			req.json = false;
			delete req.headers['Content-Type'];
			delete req['body'];
		}

		return sanitizeReq(req);

	}
	catch (err) {
		throw new Error(`Error while generating JWT token for your request ${endpoint}:  ${err}`);
	}
};

sanitizeReq = (req) => {

	// support lower case content-type
	if (req.headers['content-type'] && req.headers['Content-Type']) {
		//delete the key that was oart if the default request object.
		delete req['headers']['Content-Type'];
	}

	return req;

};