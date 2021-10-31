const Dotenv = require("dotenv");

let envPath = `./.${process.env.APP_ENV}.env`;
Dotenv.config({ path: envPath, debug: process.env.DEBUG });

const envConfig = require('./envConfig'),
  apiConfig = require('./apiConfig');

module.exports = Object.assign({}, envConfig, apiConfig) || {}