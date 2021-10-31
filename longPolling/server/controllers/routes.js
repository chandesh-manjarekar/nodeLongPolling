'use strict';
const express = require("express"),
  router = express.Router({ mergeParams: true });

// We can also add middleware to check authentication and authorization

/**
 * tags:
 * - name: "long-poll"
 *   description: "Endpoint for Long polling"
 */
router.use(
  "/long-poll",
  require("./long-poll")
);

/**
 * tags:
 * - name: "poll-page"
 *   description: "HTML page endpoint to view and send message"
 */
router.use(
  "/poll-page",
  require("./poll-page")
);

module.exports = router;
