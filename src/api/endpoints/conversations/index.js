/**
 *
 *  @type {Object}
 *  @name Conversations
 */
class Conversations {

	constructor(client) {
		this.client = client;
	}

	/**
	 * @description Get details for a conversation in Stride.
	 * @name Conversations.conversation detail
	 * @route {GET} /site/{cloudId}/conversation/{conversationId}
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId Conversation Id to fetch details.
	 * @param {object} opts none
	 * @return {object} conversation detail object with things like name, privacy, etc.
	 *  @see {@link  https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-get | Get Conversation Details}
	 */
	conversation_detail(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}`;
		return this.client.get(endpoint, opts);
	}

	/**
	 * @description Create a new conversation in Stride.
	 * @name Conversations.conversation create
	 * @route {POST} /site/{cloudId}/conversation
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {object} opts body = {name, privacy ( private or public), topic }
	 * @return {object} conversation id
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-post | Conversation Post }
	 */
	conversation_create(cloudId, opts) {
		const endpoint = `/site/${cloudId}/conversation`;
		return this.client.post(endpoint, opts);
	}

	/**
	 * @description Gets the direct conversation id.
	 * @name Conversations.conversation direct
	 * @route {GET} /site/${cloudId}/conversation/user/${userId}
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} userId User you want to get conversation id for.
	 * @param {object} opts None
	 * @return {object} conversation id.
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/ | Get Direct Conversation }
	 */
	conversation_direct(cloudId, userId, opts) {
		const endpoint = `/site/${cloudId}/conversation/user/${userId}`;
		return this.client.get(endpoint, opts);
	}

	/**
	 * @description Gets all conversations you have access to.
	 * @name Conversations.conversation get
	 * @route {GET} /site/{cloudId}/conversation
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride
	 * @param {object} opts none
	 * @returns {object} list of conversations
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-get | Get Conversations }

	 */
	conversations_all(cloudId, opts) {
		const endpoint = `/site/${cloudId}/conversation`;
		return this.client.get(endpoint, opts);
	}

	/**
	 * @description Get a Conversation Roster.
	 * @name Conversations.conversation roster
	 * @route {GET}/site/{cloudId}/conversation/{conversationId}/roster
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId conversation id to fetch room roster for.
	 * @param {opts} opts none
	 * @returns {object} list of members in a conversation
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-roster-get | Get Conversation Roster}
	 */
	conversation_roster(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/roster`;
		return this.client.get(endpoint, opts);
	}

	/**
	 * @description Archive a Conversation
	 * @name Conversations.conversation archive
	 * @route {PUT} /site/{cloudId}/conversation/{conversationId}/archive
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId conversation id to archive.
	 * @param {object} opts none
	 * @return {empty} No content
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-archive-put|Archive a Conversation}
	 */
	conversation_archive(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/archive`;
		return this.client.put(endpoint, opts);
	}

	/**
	 * @description Unarchive a Conversation
	 * @name Conversations.conversation unarchive
	 * @route {PUT} /site/{cloudId}/conversation/{conversationId}/archive
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId conversation id to unarchive.
	 * @param {object} opts none
	 * @return {empty} No Content
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-unarchive-put|Unarchive a Conversation}
	 */
	conversation_unarchive(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/unarchive`;
		return this.client.put(endpoint, opts);
	}

	/**
	 * @description Get a Conversation's History
	 * @name Conversations.conversation history
	 * @route {GET} /site/{cloudId}/conversation/{conversationId}/message
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-message-get | Conversation History }
	 * @param {string} cloudId Site
	 * @param {string} conversationId conversation id to fetch history.
	 * @param {object} opts none
	 * @return {object} last 75 messages
	 */

	/*
		  todo: need to update this and include the Query String params
	  */
	conversation_history(cloudId, conversationId, opts) {
		const endpoint = `/site/${cloudId}/conversation/${conversationId}/message`;
		return this.client.get(endpoint, opts);
	}
}

module.exports = function (client) {
	return new Conversations(client);
};
