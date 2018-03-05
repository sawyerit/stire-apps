const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger").logger;
const moduleName = "module:dialog";

/**
 *  @name Dialog
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/dialog/ | Dialogs }
 *  @description  Setup your url route and dialog key in the descriptor.json file. </b>
 *
 *  descriptor.json
 ```
 "chat:dialog": [
 {
   "key": "reference-dialog",
   "title": {
	 "value": "App Dialog"
   },
   "options": {
	 "size": {
	   "width": "500px",
	   "height": "300px"
	 }
 "url": "/module/dialog",
"authentication": "jwt"
},
]
```
**/
router.get("/dialog", function(req, res) {
	res.redirect("/public/templates/app-module-dialog.html");
	logger.info(`${moduleName} redirect successful`);
});

module.exports = router;
