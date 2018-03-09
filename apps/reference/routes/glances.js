const express = require("express");
const router = express.Router();
const cors = require("cors");
const logger = require("../middleware/logger").logger;
const moduleName = "module:glance";

const stride = require("../client");


/**
 * @name Glances
 * @description
 * This adds a glance to the sidebar. When the user clicks on it, Stride opens the module whose key is specified in "target".
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/jsapi/about-javascript-api/ | API Reference: Glances-Sidebars }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/glances-sidebars/ | Concept Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-glances/ | How-to Guide }
 * Glances are declared in the app descriptor. You can configure multiple glances in a single app descriptor.
 * When a user clicks a glance Stride opens up a target sidebar, as a chat:sidebar or chat:dialog, for the app.
 * When a user first opens a Stride conversation where the app is installed, the Stride app makes a REST call to the queryURL to get the initial value for the glance.
 * You can then update the glance for a conversation at any time by making a REST call to Stride.
 * Stride will then make sure glances are updated for all connected Stride users.
 *
 * descriptor.json setup
 * ``` "chat:glance": [
 * {
 *   "key": "glance-showcase",
 *  "name": {
 *     "value": "App Glance"
 *   },
 *   "icon": {
 *     "url": "/icon.png",
 *     "url@2x": "/icon.png"
 *   },
 *   "target": "sidebar-showcase",
 *   "queryUrl": "/glances/glance/showcase/state"
 * }
 * ]
 * ```
 *
 **/
router.get("/glance/showcase/state", cors(), (req, res) => {
  res.send(JSON.stringify({label: {value: "API Showcase"}}));
  logger.info(`${moduleName} redirect successful`);
});

router.post("/updateGlanceState", async (req, res, next) => {
  const { cloudId, conversationId } = res.locals.context;
  const loggerInfoName = "glance_update";


  try {

    //update the glance
    var glanceKey = 'glance-showcase';
    let optsDoc = {
      body: {
        "context": {
          "cloudId": cloudId,
          "conversationId": conversationId
        },
        "label": "API showcase - glance updated!",
        "metadata": {}
      }
    };
    let glanceUpdate = stride.api.glances
      .glance_update_post(glanceKey, optsDoc)
      .then(response => {
        logger.info(
          `${loggerInfoName}:glance updated, response: ${response}`
        );
        return response;
      })
      .catch(err => {
        logger.error(`${loggerInfoName} glance update error: ${err}`);
      });

    await glanceUpdate;

    // then send a confirmation message in the room

    let optsDoc2 = {
      body: "The glance state was updated",
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };

    stride.api.messages
      .message_send_conversation(cloudId, conversationId, optsDoc2)
      .then(response => {
        logger.info(
          `${loggerInfoName}:message sent to room: ${response}`
        );
        res.sendStatus(204);
      })
      .catch(err => {
        logger.error(`${loggerInfoName} glance update error: ${err}`);
      });


  } catch (err) {
    logger.error(`${loggerInfoName} error found: ${err}`);
    res.sendStatus(500);
    next(err);
  }
});

router.get("/glance/watchMessages/state", cors(), (req, res) => {
  res.send(JSON.stringify({label: {value: "Watch Messages"}}));
  logger.info(`${moduleName} redirect successful`);
});


module.exports = router;
