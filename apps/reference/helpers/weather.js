const rp = require("request-promise");
const { Document } = require("adf-builder");

//http://openweathermap.org/
module.exports.weatherRequest = (zip, country) => {
	const key = "8a641e6a60de69f99fc150acc343e5f1";
	const url = `http://api.openweathermap.org/data/2.5/forecast?zip=${zip}&lon=${country}&APPID=${key}`;
	/** Build Request PayLoad */
	const req = {
		uri: `${url}`,
		method: "GET",
		headers: { accept: "application/json", "Content-Type": "application/json" },
		json: true
	};
	return rp(req);
};

module.exports.weatherCard = (message, weatherResp) => {
	const doc = new Document();

	let card = doc
		.applicationCard("Austin, Texas")
		.link("https://developer.atlassian.com/cloud/stride/learning/adding-bots/")
		.description("All is well. Or is it?");
	card
		.detail()
		.title("Temperature")
		.text(`${convertKelvinToFaren(weatherResp.list[0].main.temp)}`);
	card.context("Utils / Weather").icon({
		url: "https://image.ibb.co/fPPAB5/Stride_White_On_Blue.png",
		label: "Stride"
	});
	return doc.toJSON();
};

function convertKelvinToFaren(kelvinNum) {
	return Number((kelvinNum - 278) * 1.8 + 32).toFixed(1);
}
