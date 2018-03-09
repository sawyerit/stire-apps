$(document).ready(function () {

  /**
   * Load configuration settings from the app backend for this conversation
   */
  AP.auth.withToken(function (err, token) {
    $.ajax(
      {
        type: 'GET',
        url: '/module/config/content',
        headers: {'Authorization': 'Bearer ' + token},
        dataType: 'json',
        success: function (data) {
          var notificationLevel = data.notificationLevel;
          switch (notificationLevel) {
            case "INSTANT":
              $("#option1").prop("checked", true);
              break;
            case "DAILY":
              $("#option2").prop("checked", true);
              break;
            default:
              $("#option3").prop("checked", true);
          }
        },
        error: function (data) {
          console.log(data);
        }
      });
  });

  /**
   * Call the app backend to save configuration settings when the user clicks on the "Save" action
   */
  AP.register({
    "dialogAction-saveConfiguration": function () {

      AP.dialog.disableActions();

      var notificationLevel = $("input[id=option1]:checked").val() ? "INSTANT" :
        $("input[id=option2]:checked").val() ? "DAILY" : "NONE";

      AP.auth.withToken(function (err, token) {
        $.ajax(
          {
            type: 'POST',
            url: '/module/config/content',
            headers: {'Authorization': 'Bearer ' + token},
            data: {'notificationLevel': notificationLevel},
            dataType: 'json',
            success: function (data) {
              AP.action.openTarget({
                "target": {
                  "key": "actionTarget-openSidebar-showcase"
                }
              });
              AP.dialog.close();
            },
            error: function (data) {
              console.log("Error" + data);
            }
          });
      });

    },
    "dialogAction-closeConfiguration": function () {
      AP.dialog.close();
    }
  });
});