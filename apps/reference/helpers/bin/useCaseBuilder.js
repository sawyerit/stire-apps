const { Document } = require("adf-builder");
const stride = require("../../client");
const fs = require("fs");
const path = require("path");

const definition_file_path = path.join(path.dirname(__dirname) + "/bin/definitions.json");

const stride_definitions = () => {
	let buffer = fs.readFileSync(definition_file_path);
	return JSON.parse(buffer);
};

class useCaseDefinition {
	/**
	 * @param {object} context REQUIRED res.locals.context
	 * @param loggerInfoName REQUIRED The loggerInfoName defined for each route
	 * @param req  Request REQUIRED req object received
	 * @param strideResponse OPTIONAL inbound response object received by App from Stride.
	 * @param opts opts.context {true / false to show context info or not }
	 * */
	constructor(context, loggerInfoName, req, strideResponse, opts = {}) {
		this.opts = opts;
		this.definitions = stride_definitions();
		this.context = context;
		this.useCase = loggerInfoName || "Stride Use Case";
		this.req = req || {};
		this.url = this.definitions[loggerInfoName] || stride_definitions["default"];
		this.stride_response = strideResponse || {};
	}

	useCaseFormat() {
		const doc = new Document();
		doc
			.panel("tip")
			.paragraph()
			.text("App Request: ")
			.link(`${this.useCase}`, `${this.url}`);

		doc.codeBlock("javascript").text("Client Request To App");
		doc.codeBlock("javascript").text(
			JSON.stringify({
				body: this.req.body,
				method: this.req.method,
				url: this.req.url
			})
		);

		let response_message = "API Responses or ADF Examples";
		doc.codeBlock("javascript").text(response_message);
		//todo: add logic to not stringify if string is a JSON
		doc.codeBlock("javascript").text(JSON.stringify(this.stride_response));

		return doc.toJSON();
	}

	send() {
		let { cloudId, conversationId } = this.context;
		let document = this.useCaseFormat();
		let opts = {
			body: document
		};
		return stride.api.messages.message_send_conversation(cloudId, conversationId, opts);
	}
}

module.exports = function(context, loggerInfoName, req, strideResponse, opts) {
	return new useCaseDefinition(context, loggerInfoName, req, strideResponse, opts);
};
