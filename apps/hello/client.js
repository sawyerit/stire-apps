const Client = require('stride-node-client');
require('dotenv').config('./env');

const { CLIENT_ID, CLIENT_SECRET, NODE_ENV } = process.env;

const stride = new Client({
  CLIENT_ID,
  CLIENT_SECRET,
  NODE_ENV,
});

module.exports = stride;
