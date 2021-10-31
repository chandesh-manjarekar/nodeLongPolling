'use strict';
const express = require("express"),
  router = express.Router({ mergeParams: true }),
  events = require("events"),
  moment = require('moment');

const eventEmitter = new events.EventEmitter();

router.get(
  "/",
  (req, res, next) => {
    global.logger.info(`${moment()} - Waiting for message...`);
    eventEmitter.once('message', (from, message) => {
      global.logger.info(`${moment()} - Message Received - from: ${from} - message: ${message}`);
        res.status(global.config.default_success_http_code)
          .json({
            responseCode: global.config.default_success_code,
            responseDesc: message,
            from
          })
          .send();
    });
  }
);

router.post(
  "/message",
  (req, res, next) => {
    const {from, message} = req.body;
    global.logger.info(`${moment()} - Message - from: ${from} - message: ${message}`);
    eventEmitter.emit('message', from, message);
    res.status(global.config.default_success_http_code)
    .json({
      responseCode: global.config.default_success_code,
      responseDesc: "Message Sent!",
    })
    .send();
  }
);

module.exports = router;
