const express = require("express");
const router = express.Router();
const cors = require("cors");
const logger = require("../middleware/logger").logger;
const moduleName = "module:sidebar";
/**
 * Sidebar
 * When a user clicks on the glance, Stride opens an iframe in the sidebar, and loads a page from your app,
 * from the URL specified in the app descriptor.
 *
 * ``` "chat:sidebar": [
 *     {
 * 		    "key": "reference-sidebar",
 * 		    "name": {
 * 		      "value": "App Sidebar"
 * 		    },
 * 		    "url": "/module/sidebar",
 * 		    "authentication": "jwt"
 * 		  }
 *    ]
 * ```
 **/

router.get("/sidebar", cors(), (req, res) => {
	res.redirect("/public/templates/app-module-sidebar.html");
	logger.info(`${moduleName} redirect successful`);
});

module.exports = router;
