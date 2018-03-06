/**
 *
 *
 *  @type {Object}
 *  @name Message
 */
class Messages {

	constructor(client) {
		this.client = client;
	}

	/**

	 * @description Send a message to a conversation
	 * @name Messages.Send Conversation Message
	 * @route {POST} /site/{cloudId}/conversation/{conversationId}/message
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId conversation id to fetch details of.
	 * @param {object} opts
	 *  ``` { body : atlassianDocFormat } ```
	 * @return {object} message id
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-post | Send Conversation Message }

	 */
	message_send_conversation(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/message`;
		return this.client.post(endpoint, opts);
	}

	/**

	 * @description Send a direct message to a user
	 * @name Messages.Send Direct Message
	 * @route {POST} /site/{cloudId}/conversation/user/{userId}/message
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} userId user id to send direct message to.
	 * @param {object} opts none
	 * @return {object} message id
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-post | Send Direct Message  }

	 */
	message_send_direct(cloudId, userId, opts) {
		const endpoint = `/site/${cloudId}/conversation/user/${userId}/message`;
		return this.client.post(endpoint, opts);
	}

	/**
	 * Edit message in a direct conversation
	 * @name Messages.Edit a Direct
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} userId user to send message to.
	 * @param {string} messageId message to be edited.
	 * @param {object} opts none
	 * @return {object} 200 OK
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-messageId-put | Edit Direct Message }
	 */
	message_update_direct(cloudId, userId, messageId, opts) {
		const endpoint = `/site/${cloudId}/conversation/user/${userId}/message/${messageId}`;
		return this.client.put(endpoint, opts);
	}

	/**
	 * Edit message in a conversation
	 * @name Messages.Edit a Conversation
	 * @param {string} cloudId Site
	 * @param {string} conversationId conversation that message is in.
	 * @param {string} messageId message to be edited.
	 * @param {object} opts none
	 * @return {empty} 200 OK
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-messageId-put | Edit Conversation Message }

	 */
	message_update_conversation(cloudId, conversationId, messageId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/message/${messageId}`;
		return this.client.put(endpoint, opts);
	}

	/**
	 * Delete message in direct conversation
	 * @name Messages.Delete a Direct
	 * @param {string} cloudId Site
	 * @param {string} userId user your in a conversation with.
	 * @param {string} messageId message to be edited.
	 * @param {object} opts
	 * @return {empty} 204 No Content
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-user-userId-message-messageId-delete | Delete Message }

	 */
	message_delete_direct(cloudId, userId, messageId, opts) {
		const endpoint = `/site/${cloudId}/conversation/user/${userId}/message/${messageId}`;
		return this.client.del(endpoint, opts);
	}

	/**
	 * Delete message in group conversation
	 * @name Messages.Delete a Conversation
	 * @param {string} cloudId Site
	 * @param {string} conversationId conversation that message is in.
	 * @param {string} messageId message to be edited.
	 * @param {object} opts
	 * @return {empty} 204 No Content
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-messageId-delete | Delete Message }

	 */
	message_delete_conversation(cloudId, conversationId, messageId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/message/${messageId}`;
		return this.client.del(endpoint, opts);
	}
}

module.exports = function (client) {
	return new Messages(client);
};
