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
            "text": "You'll need to be on the Stride web/desktop version 1.13 or higher for this to work:",
            "marks": [
              {
                type: "em"
              }
            ]
          }
        ]
      },
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
                    "appearance": "primary",
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
    .em("Note: the contract of this node will change soon.")
  return doc.toJSON();
}

module.exports.messageWithInlineSelect = () => {

  const document = {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "You'll need to be on the Stride web/desktop version 1.13 or higher for this to work:",
            "marks": [
              {
                type: "em"
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "What should I do next?"
          },
          {
            "type": "inlineExtension",
            "attrs": {
              "extensionType": "com.atlassian.stride",
              "extensionKey": "select",
              "parameters": {
                "key": "nextAction",
                "title": "Select an action",
                "source": "custom",
                "data": {
                  "value": "",
                  "options": [
                    {
                      value: "openSidebar",
                      title: "Open the showcase sidebar"
                    },
                    {
                      value: "openDialog",
                      title: "Open a dialog"
                    },
                    {
                      value: "openHighlights",
                      title: "Open room highlights"
                    },
                    {
                      value: "openRoom",
                      title: "Create and open a room"
                    },
                    {
                      value: "openFiles",
                      title: "Open room files and links"
                    }
                  ]
                },
                "action": {
                  "target": {
                    "key": "actionTarget-handleInlineMessageSelect"
                  },
                  "parameters": {
                    "key": "nextAction"
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }

  return document;
}


module.exports.inlineSelectResponseMessage = () => {

  const doc = new Document();
  doc
    .paragraph()
    .text("Done. You can try again.");
  return doc.toJSON();
}