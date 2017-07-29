/**
 * Created by anthony on 29.07.17.
 */
const logger = require('winston');

const tsFormat = function() {
    return (new Date()).toLocaleTimeString();
};

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    timestamp: tsFormat,
    colorize: true,
    level: 'info'
});

//https://stackoverflow.com/questions/14531232/using-winston-in-several-modules
module.exports = logger;