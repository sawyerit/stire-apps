/**
 *
 *
 *  @type {Object}
 *  @name Media
 */
class Media {


	constructor(client) {
		this.client = client;
	}

	/**

	 * @description Upload a media file
	 * @name Media.Upload File
	 * @route {POST} /site/{cloudId}/conversation/{conversationId}/media?name={name}
	 * @param {string} cloudId Commonly referred to as siteId or groupId, this is the group the user belongs to in Stride.
	 * @param {string} conversationId The id of the conversation where the media will be sent.
	 * @param {string} name Name of the media file with the extension included. e.g. carltonBanks.jpg, freshPrince.png
	 * @param {object} opts
	 * @return {object} media Id
	 * @see {@link https://developer.atlassian.com/cloud/stride/rest/#api-site-cloudId-conversation-conversationId-media-post | Media Upload }
	 @example
	 let opts = {
			body: stream,
			headers: [{'Content-Type': 'application/octet-stream'}]
		};
	 */
	media_file_upload(cloudId, conversationId, name, opts) {

		const endpoint = `/site/${cloudId}/conversation/${conversationId}/media?name=${name}`;
		return this.client.post(endpoint, opts);
	}
	
	media_delete(cloudId, conversationId, mediaId, opts) {

		const endpoint = `/site/${cloudId}/conversation/${conversationId}/media/${mediaId}`;
		return this.client.del(endpoint, opts);
	}
}	 

module.exports = function (client) {
	return new Media(client);
};
