const fs = require('fs');
const path = require('path');

module.exports = loadEndpoints = function(client) {
  const result = {};

  fs
    .readdirSync(__dirname)
    .filter(function(f) {
      return fs.statSync(path.resolve(__dirname, f)).isDirectory();
    })
    .forEach(function(f) {
      // returns module which is a class that takes client as an arg.
      const r = require(path.resolve(__dirname, f));
      // Iterate and build a object that will be our endpoints: example: { 'conversations' : module(client) }
      result[f] = r(client);
    });

  return result;
};
