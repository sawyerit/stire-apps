const rp = require('request-promise');
const loadEndpoints = require('../api/endpoints/index');
const apiRequest = require('../api/index');

class Stride {
	constructor(opts) {
		this.auth = {clientId: opts.CLIENT_ID, secret: opts.CLIENT_SECRET};

		this.api = loadEndpoints(this);
	}

	async get(endpoint, opts = {}) {
		let req = await apiRequest(this.auth, 'GET', endpoint, opts);
		return rp(req);
	}

	async post(endpoint, opts = {}) {
		let req = await apiRequest(this.auth, 'POST', endpoint, opts);
		return rp(req);
	}

	async put(endpoint, opts = {}) {
		let req = await apiRequest(this.auth, 'PUT', endpoint, opts);
		return rp(req);
	}

	async del(endpoint, opts = {}) {
		let req = await apiRequest(this.auth, 'DELETE', endpoint, opts);
		return rp(req);
	}

	async helper(endpoint, method, opts = {}) {
		let req = await apiRequest(this.auth, method, endpoint, opts);
		return rp(req);
	}

}

module.exports = Stride;
