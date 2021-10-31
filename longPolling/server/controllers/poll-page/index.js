'use strict';
const express = require("express"),
  router = express.Router({ mergeParams: true }),
  fs = require('fs');

router.get(
  "/",
  (req, res, next) => {
    fs.createReadStream("./server/html/client.html").pipe(res);
  }
);

module.exports = router;
