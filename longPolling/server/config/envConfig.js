const os = require("os");

module.exports = {
  environmentName: process.env.NODE_ENV,
  cors: {
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false
  },
  appPort: process.env.APP_PORT,
  protocol: "http://",
  subDomain: "",
  domain: process.env.APP_HOST,
  appSSL: {
    enabled: false,
    cert: "",
    key: ""
  },
  logs: {
    logFolder: `./logs/${os.hostname()}`
  }
}