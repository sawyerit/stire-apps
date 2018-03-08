const { Document } = require("adf-builder");

const app_name = process.env.APP_NAME || "Stride Reference App";

module.exports.messageWithInlineActions = () => {
  return {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Do you approve?"
          }
        ]
      },
      {
        "type": "bodiedExtension",
        "attrs": {
          "extensionType": "com.atlassian.stride",
          "extensionKey": "actionGroup"
        },
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "inlineExtension",
                "attrs": {
                  "extensionType": "com.atlassian.stride",
                  "extensionKey": "action",
                  "parameters": {
                    "title": "Approve",
                    "appearance": "default",
                    "action": {
                      "target": {
                        "key": "actionTarget-handleInlineMessageAction"
                      },
                      "parameters": {
                        "reason": "approve"
                      }
                    }
                  }
                }
              },
              {
                "type": "inlineExtension",
                "attrs": {
                  "extensionType": "com.atlassian.stride",
                  "extensionKey": "action",
                  "parameters": {
                    "title": "Reject",
                    "appearance": "default",
                    "action": {
                      "target": {
                        "key": "actionTarget-handleInlineMessageAction"
                      },
                      "parameters": {
                        "reason": "reject"
                      }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
};

module.exports.inlineActionResponseMessage = (userId, reason) => {
  let approvalTxt =
    reason === "approve" ?
      "Approved by " : "Rejected by ";

  const doc = new Document();
  doc
    .paragraph()
    .text("Do you approve?");
  doc.paragraph()
    .strong(approvalTxt)
    .mention(userId)
  doc.paragraph()
    .em("Note: the contract of this node will change soon. Also, the target solution supports loading/error states")
  return doc.toJSON();
}
