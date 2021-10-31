'use strict';
const express = require('express'),
  app = express(),
  device = require('express-device'),
  fs = require('fs'),
  path = require('path'),
  cuid = require('cuid'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  winston = require('winston'),
  morgan = require('morgan'),
  moment = require('moment');


/**
* Globally define the application config variables
**/
global.config = require('./server/config/');


/**
 * Protocol  
 **/
const httpProtocol = (global.config.appSSL.enabled ? require("https") : require("http"));


/**
 * Create the directory for writing the logs
**/
let logFolder = global.config.logs.logFolder;
if (!fs.existsSync(logFolder)) {
  try {
    fs.mkdirSync(logFolder);
  } catch (e) {
    throw new Error(`Error creating log folder ${logFolder} - ${JSON.stringify(e)}`);
  }
}


/**
* Collision-resistant ids optimized for horizontal scaling and binary search lookup performance..
**/
app.use('*', (req, res, next) => {
  req.headers['X-Request-Id'] = cuid();
  next();
});


/**
* Decrease the size of the response body to increase the speed of a web application.
**/
app.use(compression());


/**
* Capture the device information of the user.
**/
app.use(device.capture({ parseUserAgent: true }));


/**
* Create access log stream.
**/
const accessLogStream = fs.createWriteStream(`${logFolder}/access.log`, { flags: 'a' });


/**
* Initialize access log writer.
**/
global.logger = new winston.Logger({
  transports: [
    new (winston.transports.File)({
      timestamp: () => {
        return moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
      },
      formatter: (options) => {
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      level: 'verbose',
      colorize: true,
      name: 'access-file',
      stream: accessLogStream,
      handleExceptions: false,
      humanReadableUnhandledException: false,
      json: false
    }),
    new (winston.transports.Console)()
  ],
  exitOnError: false
});


/**
* Create server log stream.
**/
const serverLogStream = fs.createWriteStream(`${logFolder}/server.log`, { flags: 'a' });


/**
* Define server log date format.
**/
morgan.token('date', (req, res) => {
  return moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
});


/**
* Define server log request headers to be written.
**/
morgan.token('type', (req, res) => {
  return JSON.stringify(req.headers);
});


/**
* Define server log user device information to be written.
**/
morgan.token('device', (req, res) => {
  return `DEVICE=${JSON.stringify(req.device)}`;
});


/**
* Define server log UUID to be written.
**/
morgan.token('uuid', (req, res) => {
  return `UUID=${res.getHeaders()['x-request-id']}`;
});


/**
* Initialize server log writer.
**/
app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :type :device :uuid - :response-time ms', { stream: serverLogStream }));


/**
* Initialize post data parsing.
**/
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'uploads')))


/**
 * CORS middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let allowCrossDomain = function (req, res, next) {
  var allowOrigin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authentication, x-access-token, x-auth-header, x-refresh-token, authorization, clientid, clientsecret");
  res.header("Access-Control-Expose-Headers", "x-auth-header, x-refresh-token");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
};
app.use(allowCrossDomain);


/**
* Initialize the router.
**/
app.use(require('./server/routes'));

/**
* Health check to check application is up and running.
**/
app.use("/healthz", require('./server/middleware/healthCheck'));


/**
* Default handler for invalid API endpoint.
**/
app.all('*', (req, res) => {
  res.status(global.config.default_error_http_code).json({ "responseCode": global.config.default_error_code, "responseDesc": global.config.default_error_message });
});

/**
* Default handler for uncaught exception error.
**/
app.use((err, req, res, next) => {
  global.logger.error("UUID=" + res._headers['x-request-id'], "UncaughtException is encountered", "Error=" + err, "Stacktrace=" + err.stack);
  let response = { "responseCode": global.config.default_error_code, "responseDesc": global.config.service_down_message };
  if (res.headersSent) {
    clearInterval(req.timer);
    response = JSON.stringify(response);
    response = response.replace(/^({)/, "");
    return res.end('",' + response);
  }
  res.status(global.config.service_error_http_code).json(response);
});

/**
* To start express server with secure connection.
**/
let httpServer = null;
if (global.config.appSSL.enabled) {
  let credentials = null;
  try {
    const certificate = fs.readFileSync(global.config.appSSL.appSSL.cert, 'utf8');
    const privateKey = fs.readFileSync(global.config.appSSL.appSSL.key, 'utf8');
    credentials = { cert: certificate, key: privateKey };
  } catch (e) {
    throw new Error(`Error reading the ssl files ${JSON.stringify(e)}`);
  }
  httpServer = httpProtocol.createServer(credentials, app);
} else {
  httpServer = httpProtocol.createServer(app);
}

/**
* Server start port.
**/
httpServer.listen(global.config.appPort, () => {
  global.logger.info(`Server started on ${global.config.environmentName.charAt(0).toUpperCase() + global.config.environmentName.slice(1)} server started at port ${global.config.appPort}`);
});