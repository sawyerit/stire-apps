const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger").logger;
const moduleName = "module:dialog";

/**
 *  @name Dialogs
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/dialog/ | API Reference: Dialogs }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/dialogs/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-dialogs | How-to Guide }
 *  @description
 *  To create a dialog, add a chat:dialog module to the app descriptor.
 *  The dialog will open when it is the target of an action and the action is fired, or from another module using the JavaScript API.
 *
 ```
 "chat:dialog": [
 {
   "key": "dialog-1",
   "title": {
	 "value": "App Dialog"
   },
   "options": {
	 "size": {
	   "width": "500px",
	   "height": "300px"
	 }
 "url": "/dialogs/dialog",
"authentication": "jwt"
},
]
```
**/
router.get("/dialog", function(req, res) {
	res.redirect("/public/templates/dialog.html");
	logger.info(`${moduleName} redirect successful`);
});

module.exports = router;
