/**
 *
 *
 *  @type {Object}
 *  @name Users
 */
class Users {

	constructor(client) {
		this.client = client;
	}

	/**
	 * @name Users.User Details
	 * @description Fetch user details. e.g. name, email, etc.
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} userId User's Id to fetch details.
	 * @param {object} opts none
	 * @returns {object} details about a user like their name, email, mention.
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-get | User Details }
	 */
	async user_details_get(cloudId, userId, opts) {
		const endpoint = `/scim/site/${cloudId}/Users/${userId}`;
		return this.client.get(endpoint, opts);
	}

	/**
	 * @name Users.Me Details
	 * @description Fetch details for the app user
	 * @returns {object} details about the app's user.
	 */
	async me() {
		const endpoint = `/me`;
		const opts = {};
		return this.client.get(endpoint, opts);
	}

}

module.exports = function (client) {
	return new Users(client);
};
