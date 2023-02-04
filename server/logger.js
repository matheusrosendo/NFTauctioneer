
const pino = require('pino');
const Util = require("commonutils")

module.exports = pino({}, `./server/logs/${Util.formatDateTimeForFilename(new Date())}.log`);