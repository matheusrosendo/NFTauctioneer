
const pino = require('pino');
const Util = require("commonutils")

module.exports = pino({}, `./logs/${Util.formatDateTimeForFilename(new Date())}.log`);