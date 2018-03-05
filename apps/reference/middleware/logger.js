const bunyan = require("bunyan");
const bformat = require("bunyan-format");
let url = require("url");

//app logger
let loggerConfig = {
	name: "app-logger",
	level: "debug",
	stream: bformat({outputMode: "short"}),

	includesFn: function (req, res) {

		let shortUrl = url.parse(req.url).pathname;

		return {
			method: req.method,
			url: shortUrl,
			body: req.body,
			incoming: req.incoming
		};
	}
};

let logger = bunyan.createLogger(loggerConfig);

let loggerConfigMiddleare = {
	format: ":incoming :shortUrl :method :status-code",
	name: "app-authentication",
	streams: [
		{
			level: "debug",
			stream: bformat({outputMode: "short"})
		}
	],

	includesFn: function (req, res) {
		let shortUrl = url.parse(req.originalUrl).pathname;
		return {
			url: shortUrl
		};
	},
	excludes: [
		"ip",
		"response-hrtime",
		"hostname",
		"v",
		"req-headers",
		"remote-address",
		"res-headers",
		"headers",
		"os",
		"device",
		"user-agent",
		"req",
		"incoming",
		"res",
		"msg",
		"req_id",
		"method",
		"referer",
		"http-version",
		"response-time",
		"status-code"
	]
};

module.exports = {logger, LogMiddleware: loggerConfigMiddleare};
