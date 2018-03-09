
$(document).ready(function () {

	$("#createStrideButton").click(function() {

		var installationUrl = $("#installUrl").val();
		var relayState = $("#relayState").val();

		var marketplaceBaseUrl = "https://app.stride.com/marketplace?target=install&app_url=";

		var connectToStrideUrl = marketplaceBaseUrl+encodeURI(installationUrl);

		if(relayState && relayState === "");
			connectToStrideUrl += "&relayState="+relayState;

		var strideButton =
				"<p>Click on this button to install your app in a Stride room</p><br/>"
				+ "<a target=\"_blank\" href=\"" + connectToStrideUrl + "\">"
				+ "<img width=\"170\" src=\"https://developer.atlassian.com/cloud/stride/images/stride-connect-button@2x.png\"/>"
				+"</a>"

		$("#strideButton").html(strideButton);
	});

});

