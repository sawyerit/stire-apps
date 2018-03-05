const rp = require('request-promise');

/**
 * @description Called by stride client to generate oauth token for outgoing requests.
 * @name Authentication
 * @param {string} clientId string client id of the app.
 * @param {string} secret string client secret of the app.
 * @param {string} baseUrl API environment URL to generate Oauth Token
 * @return {string} returns an oauth token in string format.
 * @see {@link https://developer.atlassian.com/cloud/stride/security/authentication/ | Authentication }
 ```
 async function oauth(clientId, secret, baseUrl) {
	const options = {
		uri: baseUrl + '/oauth/token',
		method: 'POST',
		json: {
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: secret,
			audience: baseUrl.replace('https://', ''),
		},
	};
``` 
*/
async function oauth(clientId, secret, baseUrl) {

	const options = {
		uri: baseUrl + '/oauth/token',
		method: 'POST',
		json: {
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: secret,
			audience: baseUrl.replace('https://', ''),
		},
	};

	return rp(options)
		.then(resp => {
			return resp.access_token;
		})
		.catch(err => {
			throw new Error(`unable to generate token. check your NODE_ENV is production, CLIENT_ID and CLIENT_SECRET values are correct. ${err}`);
		});
}

module.exports = oauth;
