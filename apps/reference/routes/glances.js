const express = require("express");
const router = express.Router();
const cors = require("cors");
const logger = require("../middleware/logger").logger;
const moduleName = "module:glance";

/**
 * @name Glance
 * @description
 * This adds a glance to the sidebar. When the user clicks on it, Stride opens the module whose key is specified in "target".
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/jsapi/about-javascript-api/ | API Reference: Glances-Sidebars }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/glances-sidebars/ | Concept Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-glances/ | How-to Guide }
 * When a user first opens a Stride conversation where the app is installed, the Stride app makes a REST call to the queryURL to get the initial value for the glance.
 * You can then update the glance for a conversation at any time by making a REST call to Stride.
 * Stride will then make sure glances are updated for all connected Stride users.
 *
 * descriptor.json setup
 * ``` "chat:glance": [
 * {
 *   "key": "reference-glance",
 *  "name": {
 *     "value": "App Glance"
 *   },
 *   "icon": {
 *     "url": "/icon.png",
 *     "url@2x": "/icon.png"
 *   },
 *   "target": "reference-sidebar",
 *   "queryUrl": "/module/glance/state"
 * }
 * ]
 * ```
 *
 **/
router.get("/glance/state", cors(), (req, res) => {
	res.send(JSON.stringify({ label: { value: "Glance Sidebar Opened" } }));
	logger.info(`${moduleName} redirect successful`);
});

module.exports = router;
