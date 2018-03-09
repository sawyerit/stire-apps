/**
 *
 *
 *  @type {Object}
 *  @name Glance
 */
class Glance {

	constructor(client) {
		this.client = client;
	}

	/**

	 * @description  updates glance state.
	 * @name  Glance.Update Glance
	 * @route {POST} /app/module/chat/conversation/chat:configuration/${configKey}/state
	 * @param {string} configKey Configuration Key used to update stride. See Example.
	 * @param {string} opts body = {  context: {  cloudId, conversationId, userId } }
	 * @return {empty} none
	 * @link https://developer.atlassian.com/cloud/stride/rest/#api-app-module-chat-conversation-chat-glance-key-state-post
	 * @example Descriptor.json
	 *
	 "chat:glance": [
	 {
	   "key": "glance-showcase",
	   "name": {
		 "value": "App Glance"
	   },
	   "icon": {
		 "url": "/public/img/logo.png",
		 "url@2x": "/public/img/logo.png"
	   },
	   "target": "actionTarget-openSidebar-showcase",
	   "queryUrl": "/glances/glance/showcase/state",
	   "authentication": "jwt"
	 }
	 ]
	 */
	async glance_update_post(glanceKey, opts) {
		const endpoint = `/app/module/chat/conversation/chat:glance/${glanceKey}/state`;
		return this.client.post(endpoint, opts);
	}
}

module.exports = function (client) {
	return new Glance(client);
};
