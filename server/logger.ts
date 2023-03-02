const util = require("commonutils");
import pino from 'pino';

export default pino({}, pino.destination(`./logs/${util.formatDateTimeForFilename(new Date())}.log`));