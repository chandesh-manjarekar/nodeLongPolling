'use strict';
const express = require('express'),
  router = express.Router();

/**
 * tags:
 * - name: "long-poll"
 *   description: "Endpoints for Long polling"
 */
router.use('/api', require('../controllers/routes'));

module.exports = router;
