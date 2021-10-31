const os = require("os");

module.exports = (req, res, next) => {
  // check for the status of mongo, redis, rabbitmq(publisher/subscriber), etc.

  let status = 200;

  /* if (// check of status of each service by importing and connecting to it) {
    status = 500;
  } */

  return res
    .status(status)
    .json({
      freeMem: os.freemem(),
      hostname: os.hostname()
    })
    .send();
};