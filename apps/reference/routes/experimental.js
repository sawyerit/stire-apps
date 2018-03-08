const express = require("express");
const router = express.Router();
const cors = require("cors");
const util = require("util");

const stride = require("../client");
const logger = require("../middleware/logger").logger;
let helpers = require("../helpers");
const { Document } = require("adf-builder");

/** !!!!!!! Experimental: use at your own risk!
 * Things in this section are likely to break and NOT SUPPORTED !!!!!!
 */

/**
 * Inline message action
 */

router.options("/action/handleInlineMessageAction", cors(), (req, res) => {
  res.sendStatus(200);
});

/**
 * @name Experimental: Message with inline actions
 */
router.post("/inlineMessageAction", async (req, res, next) => {
  let loggerInfoName = "inline_message_actions";
  logger.info(`${loggerInfoName} incoming request`);

  try {
    const { cloudId, conversationId } = res.locals.context;

    let messageWithInlineActions = helpers.experimental.messageWithInlineActions();

    let messageOpts = {
      body: messageWithInlineActions
    };

    stride.api.messages
      .message_send_conversation(cloudId, conversationId, messageOpts)
      .then(messageResponse => {
        res.sendStatus(204);
        logger.info(
          `${loggerInfoName} outgoing successful ${util.format(messageResponse)}`
        );
      })
      .catch(err => {
        logger.error(`${loggerInfoName} sending the message found error: ${err}`);
      });
  } catch (err) {
    res.sendStatus(500);
    logger.info(`${loggerInfoName} error: ${err}`);
    next(err);
  }
});

router.post("/action/handleInlineMessageAction", cors(), async (req, res, next) => {
  const loggerInfoName = "inline_message_actions_clicked";

  try {
    const { cloudId, conversationId, userId } = res.locals.context;
    logger.info(`${loggerInfoName} incoming call for ${conversationId}`);

    const parameters = req.body.parameters;

    let replacementMessage = helpers.experimental.inlineActionResponseMessage(userId, parameters.reason);
    var messageToEditId = req.body.context.message.mid;

    let messageOpts = {
      body: replacementMessage
    };

    stride.api.messages
      .message_update_conversation(cloudId, conversationId, messageToEditId, messageOpts)
      .then(messageResponse => {
        res.sendStatus(204);
        logger.info(
          `${loggerInfoName} sent message successfully ${util.format(messageResponse)}`
        );
      })
      .catch(err => {
        logger.error(`${loggerInfoName} sending the message found error: ${err}`);
      });

    res.sendStatus(204);

  } catch (err) {
    logger.error(`${loggerInfoName}:action error: ${err}`);
    res.sendStatus(500);
    next(err);
  }
});

/**
 * Inline select
 */

router.options("/inlineMessageSelect", cors(), (req, res) => {
  res.sendStatus(200);
});

router.post("/inlineMessageSelect", async (req, res, next) => {
  let loggerInfoName = "inline_message_select";
  logger.info(`${loggerInfoName} incoming request`);

  try {
    const { cloudId, conversationId } = res.locals.context;

    let messageWithInlineSelect = helpers.experimental.messageWithInlineSelect();

    let messageOpts = {
      body: messageWithInlineSelect
    };

    stride.api.messages
      .message_send_conversation(cloudId, conversationId, messageOpts)
      .then(messageResponse => {
        res.sendStatus(204);
        logger.info(
          `${loggerInfoName} outgoing successful ${util.format(messageResponse)}`
        );
      })
      .catch(err => {
        logger.error(`${loggerInfoName} sending the message found error: ${err}`);
      });
  } catch (err) {
    res.sendStatus(500);
    logger.info(`${loggerInfoName} error: ${err}`);
    next(err);
  }
});

router.post("/action/handleInlineMessageSelect", cors(), async (req, res, next) => {
    const loggerInfoName = "inline_select_clicked";

    try {
      const { cloudId, conversationId} = res.locals.context;
      logger.info(`${loggerInfoName} incoming call for ${conversationId}`);

      const parameters = req.body.parameters;

      var response = {
        nextAction: ''
      }

      if (parameters) {
        if (parameters.selectedValue) {
          if (parameters.selectedValue === "openSidebar") {
            response.nextAction = {
              target: {
                key: "actionTarget-openSidebar-showcase"
              }
            };
          }
          if (parameters.selectedValue === "openDialog") {
            response.nextAction = {
              target: {
                key: "actionTarget-sendToDialog"
              }
            };
          }
          //if (parameters.selectedValue === "openRoom") {
          //  response.nextAction = {
          //    target: {
          //      openConversation: {
          //        conversationId: parameters.conversationId
          //      }
          //    }
          //  };
          //}
          //  if (parameters.selectedValue === "openHighlights") {
          //    response.nextAction = {
          //      target: {
          //        openHighlights: {}
          //      }
          //    };
          //  }
          //  if (parameters.selectedValue === "openFiles") {
          //    response.nextAction = {
          //      target: {
          //        openFilesAndLinks: {}
          //      }
          //    };
          //  }
        }
      }

      let responseMessage = helpers.experimental.inlineSelectResponseMessage();

      let messageOpts = {
        body: responseMessage
      };


      stride.api.messages
        .message_send_conversation(cloudId, conversationId, messageOpts)
        .then(messageResponse => {
          res.sendStatus(204);
          logger.info(
            `${loggerInfoName} sent message successfully ${util.format(messageResponse)}`
          );
        })
        .catch(err => {
          logger.error(`${loggerInfoName} sending the message found error: ${err}`);
        });

      res.json(response);

    }
    catch
      (err) {
      logger.error(`${loggerInfoName}:action error: ${err}`);
      res.sendStatus(500);
      next(err);
    }
  }
);


module.exports = router;
