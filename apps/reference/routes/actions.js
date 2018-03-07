const express = require("express");
const router = express.Router();
const cors = require("cors");
const util = require("util");

const stride = require("../client");
const logger = require("../middleware/logger").logger;
let helpers = require("../helpers");
const { Document } = require("adf-builder");


router.options("/action/handleMessage", cors(), (req, res) => {
  res.sendStatus(200);
});
router.options("/action/handleCardAction", cors(), (req, res) => {
  res.sendStatus(200);
});
router.options("/action/updateCard", cors(), (req, res) => {
  res.sendStatus(200);
});

/**
 * @name Actions: Message with a card
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/actions/ | Concept Guide}
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-actions/ | How-to Guide}
 */
router.post("/actionCard", async (req, res, next) => {
  let loggerInfoName = "action_card";
  logger.info(`${loggerInfoName} incoming request`);

  try {
    const { cloudId, conversationId } = res.locals.context;

    let actionCard = helpers.actions.actionCard();

    let actionCardOpts = {
      body: actionCard
    };

    stride.api.messages
      .message_send_conversation(cloudId, conversationId, actionCardOpts)
      .then(actionCardMessageResponse => {
        res.sendStatus(204);
        logger.info(
          `${loggerInfoName} outgoing successful ${util.format(actionCardMessageResponse)}`
        );
      })
      .catch(err => {
        logger.error(`${loggerInfoName} sending the card found error: ${err}`);
      });
  } catch (err) {
    res.sendStatus(500);
    logger.info(`${loggerInfoName} error: ${err}`);
    next(err);
  }
});

router.post("/action/handleCardAction", cors(), async (req, res, next) => {
  const loggerInfoName = "action_service";

  try {
    const { cloudId, conversationId } = res.locals.context;
    logger.info(`${loggerInfoName} incoming call for ${conversationId}`);

    const parameters = req.body.parameters;

    let response = {
      nextAction: {}
    };

    if (parameters.returnError) {
      response.error = "Things failed because of some reason";
    } else {
      response.message = "Done!";
    }

    if (parameters) {
      if (parameters.then) {
        if (parameters.then === "open sidebar") {
          response.nextAction = {
            target: {
              key: "actionTarget-openSidebar"
            }
          };
        }
        if (parameters.then === "open dialog") {
          response.nextAction = {
            target: {
              openDialog: {
                key: "dialog-1"
              }
            }
          };
        }
        if (parameters.then === "open conversation") {
          response.nextAction = {
            target: {
              openConversation: {
                conversationId: parameters.conversationId
              }
            }
          };
        }
        if (parameters.then === "open highlights") {
          response.nextAction = {
            target: {
              openHighlights: {}
            }
          };
        }
        if (parameters.then === "open files and links") {
          response.nextAction = {
            target: {
              openFilesAndLinks: {}
            }
          };
        }
      }
    }

    if (parameters.returnError) {
      res.sendStatus(403);
    } else {
      res.json(response);
    }
  } catch (err) {
    logger.error(`${loggerInfoName}:action error: ${err}`);
    res.sendStatus(500);
    next(err);
  }
});

router.post("/action/handleMessage", cors(), async (req, res, next) => {
  const loggerInfoName = "action_handle_message";

  const { cloudId, conversationId } = res.locals.context;
  logger.info(`${loggerInfoName} incoming call for ${conversationId}`);

  try {
    var messageToAction = req.body.context.message.body;
    helpers.actions.ackMessage(messageToAction);
    let opts = {
      body: messageToAction,
      headers: {"Content-Type": "Application/Json"}
    };
    let response = stride.api.messages
      .message_send_conversation(cloudId, conversationId, opts)
      .catch(err => {
        logger.error(`${loggerInfoName} error echoing the message: ${err}`);
      });

    await response

    logger.info(
      `${loggerInfoName} echo'd the message with response ${util.format(response)}`
    );
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
    logger.error(`${loggerInfoName} found an error: ${err} `);
    next(err);
  }

});

/**
 * @name Actions: Message with a card which updates when an action is clicked
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/actions/ | Concept Guide}
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-actions/ | How-to Guide}
 */

router.post("/updateCard", cors(), async (req, res, next) => {
  const loggerInfoName = "send_update_card";

  try {
    logger.info(`${loggerInfoName} incoming with request body ${util.format(req.body)}`);

    const { cloudId, conversationId } = res.locals.context;
    let updateCard = helpers.actions.updateCard();

    let opts = {
      body: updateCard,
      headers: {"Content-Type": "Application/Json"}
    };

    let response = stride.api.messages
      .message_send_conversation(cloudId, conversationId, opts)
      .catch(err => {
        logger.error(`${loggerInfoName} sending the card found error: ${err}`);
      });

    logger.info(
      `${loggerInfoName} outgoing call successful with response ${util.format(response)}`
    );
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
    logger.error(`${loggerInfoName} found an error: ${err} `);
    next(err);
  }
});

router.post("/action/updateCard", async (req, res, next) => {
  const loggerInfoName = "update_action_card_message";

  try {
    const { cloudId, conversationId } = res.locals.context;

    const messageId = req.body.context.message.mid;
    const parameters = req.body.parameters;

    let doc = new Document();

    let card = doc
      .applicationCard("Incident #4253")
      .link("https://www.helpers.com")
      .description("Something is broken");

    if (parameters.incidentAction === "ack") {
      card
        .detail()
        .title("Status")
        .text("In progress");
      card
        .detail()
        .title("Assigned to")
        .text("Joe Blog");
      card
        .action()
        .title("Resolve")
        .target({key: "actionTarget-updateCard"})
        .parameters({incidentAction: "resolve"});
    }

    if (parameters.incidentAction === "resolve") {
      card
        .detail()
        .title("Status")
        .text("Resolved");
      card
        .action()
        .title("Reopen")
        .target({key: "actionTarget-updateCard"})
        .parameters({incidentAction: "reopen"});
    }

    if (parameters.incidentAction === "reopen") {
      card
        .detail()
        .title("Status")
        .text("Reopened");
      card
        .action()
        .title("Ack")
        .target({key: "actionTarget-updateCard"})
        .parameters({incidentAction: "ack"});
      card
        .action()
        .title("Resolve")
        .target({key: "actionTarget-updateCard"})
        .parameters({incidentAction: "resolve"});
    }

    card.context("DevOps / Incidents").icon({
      url: "https://image.ibb.co/fPPAB5/Stride_White_On_Blue.png",
      label: "Stride"
    });

    let document = doc.toJSON();
    let opts = {
      body: document,
      headers: {"Content-Type": "Application/Json"}
    };

    stride.api.messages
      .message_update_conversation(cloudId, conversationId, messageId, opts)
      .then(cardUpdateResponse => {
        res.sendStatus(204);
        logger.info(
          `${loggerInfoName} outgoing call successful with response ${util.format(
            cardUpdateResponse
          )}`
        );
      })
      .catch(err => {
        logger.error(`${loggerInfoName} card update found error: ${err}`);
      });
  } catch (err) {
    logger.error(`${loggerInfoName} found an error: ${err} `);
    res.sendStatus(500);
    next(err);
  }
});

module.exports = router;
