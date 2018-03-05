/**
 *
 *
 *  @type {Object}
 *  @name Config
 */
class Config {


	constructor(client) {
		this.client = client;
	}

	/**
	 * @name Config.Config Update
	 * @description Update Configuration State
	 * @param {string} configKey Key used to describe the type of configuration you are getting or setting, e.g. reference-sidebar, reference-config, reference-glance.
	 * This is done in the descriptor file.
	 * @param {object} opts opts.body = { "context": { cloudId, conversationId }, "configured": true || false }
	 * @return {empty} none
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-app-module-chat-conversation-chat-configuration-key-state-post | Config Update }
	 *
	 * ``` body = { "context": { cloudId, conversationId }, "configured": state } ```
	 *
	 */

	async config_update_post(configKey, opts) {

		const endpoint = `/app/module/chat/conversation/chat:configuration/${configKey}/state`;
		return this.client.post(endpoint, opts);
	}
}

module.exports = function (client) {
	return new Config(client);
};
