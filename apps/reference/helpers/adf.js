/** Format Conversation */
const stride = require("../client");

/** @name Format - md 2 Atlassian
 *  @description
 *  Function that takes markdown as a param and returns an Atlassian Document.
 *
 ```
 opts.headers = {
         accept: 'application/json',
		'Content-Type': 'application/json',
	};
 opts.body = {input: markdown};
 return stride.helper('/pf-editor-service/convert?from=markdown&to=adf', 'POST', opts);

 ```
 */
module.exports.md2AtlassianFormat = async function(markdown) {
	let opts = {};
	opts.headers = {
		accept: "application/json",
		"Content-Type": "application/json"
	};
	opts.body = { input: markdown };
	return stride.helper("/pf-editor-service/convert?from=markdown&to=adf", "POST", opts);
};

/** @name Format - Atlassian 2 Text
 *  @description
 *  Takes a Atlassian Document as a parameter, calls Atlassian editor service and returns plain/text.
 *
 ```
 opts.headers = {
		accept: 'text/plain',
		'Content-Type': 'application/json',
	};

 opts.body = document;
 return stride.helper('/pf-editor-service/render', 'POST', opts);

 ```
 */
module.exports.AtlassianFormat2Text = async function(document) {
	let opts = {};
	opts.headers = {
		accept: "text/plain",
		"Content-Type": "application/json"
	};

	opts.body = document;
	return stride.helper("/pf-editor-service/render", "POST", opts);
};

/** @name Format - Text 2 Atlassian
 *  @description
 *  Simple function that takes string as a param and returns an Atlassian Document with the string as part of the object.
 *
 *  ```
 *    return {
		version: 1, type: "doc", content: [{
			type: "paragraph", content:
				[{
					type: "text",
					<your text here>,
				}]
		}],
	};

 ```
 */
module.exports.text2Atlassian = function(text) {
	if (typeof text !== "string") {
		throw Error("Text2AtlassianFormat Not possible. What was passed is not string format.");
	}

	return {
		version: 1,
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						text
					}
				]
			}
		]
	};
};
