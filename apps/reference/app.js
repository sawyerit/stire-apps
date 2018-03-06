const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// loads environment variables from .env file created
require("dotenv").config("./env");
const routes = require("./routes");

//middleware requires
const { authMiddleware } = require("./middleware/mw");
let { LogMiddleware } = require("./middleware/logger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//logging middleware

//auth middleware
app.use(authMiddleware(process.env.CLIENT_SECRET));
app.use(require("express-bunyan-logger")(LogMiddleware));

//public assets
app.use("/public/js", express.static("public/js"));
app.use("/public/img", express.static("public/img"));
app.use("/public/templates", express.static("public/templates"));

//configure express routes
app.use("/help", routes.help);
app.use("/module", routes.configuration);
app.use("/module", routes.glances);
app.use("/module", routes.sidebar);
app.use("/module", routes.dialog);
app.use("/actions", routes.actions);
app.use("/messages", routes.messages);
app.use("/conversations", routes.conversations);
app.use("/media", routes.media);
app.use("/webhooks", routes.webhooks);
app.use("/users", routes.users);
app.use("/lifecycle", routes.lifecycle);
app.use("/custom", routes.custom);

function envcheck() {
	if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.NODE_ENV) {
		console.error(
			"Please set CLIENT_ID, CLIENT_SECRET and NODE_ENV as env variables in a .env or on the system."
		);
		process.exit(1);
	}
	if (!process.env.APP_NAME) process.env.APP_NAME = "Stride Reference App";
	if (!process.env.PORT) process.env.PORT = 8080;
}

app.listen(process.env.PORT, function() {
	envcheck();
	console.log(`Starting Server @ port ${process.env.PORT}....`);
	console.log(`Server now listening on port ${process.env.PORT} successfully!`);
});
